//MIT License - Copyright (c) 2020-2021 Picorims

//EXPORTING THE PROJECT INTO A VIDEO || MAIN PROCESS PART (completely excluded from renderer window process)

var export_mode = false; //not in export window
var max_frames; //allow setting the max progress through every progress event.

function Export(path) {//Launch the rendering process which will export the video
    if (typeof audio === "undefined") {
        MessageDialog("warn","No audio file selected!");
        return;
    }

    CustomLog("info","Exporting...");
    StopAnimating();//this avoids useless background process in the main window

    //create renderer window
    ipcRenderer.invoke('create-export-win');

    //wait callback
    ipcRenderer.once("renderer-exists", async (event) => {//once avoid the listener to be persistent (if it was,
                                                    //on window re-open, a new listener would stack upon this
                                                    //one, making multiple process stacking on forever.
        CustomLog("debug","renderer created, sending data...");


        //data to send to the renderer process (the project, so it can be recreated into the new window)
        let filename = current_save.audio_filename;
        let extension = filename.replace(/^.*\./,"");
        if (imports.utils.IsUndefined(audio_file_type)) {
            switch (extension.toLowerCase()) {
                case 'mp3': audio_file_type = 'audio/mp3'; break;
                case 'wav': audio_file_type = 'audio/wav'; break;
                case 'ogg': audio_file_type = 'application/ogg'; break;
                default: throw `Export: Unknown audio type!`;
            }
        }
        var data = {
            screen: {
                width: screen.width,
                height: screen.height,
            },
            save: current_save,
            audio_file_type: audio_file_type,
            audio_file_extension: extension,
            output_path: path,
        }

        //cache audio for rendering in a separate file.
        await ipcRenderer.invoke("copy-file", `${working_dir}/temp/current_save/assets/audio/${filename}`, `${working_dir}/temp/temp.${extension}`);
        
        //send data to the export window renderer
        await ipcRenderer.invoke("send-event-to-export-win", "data-sent", data);

        //LEGACY AUDIO CACHING FOR File() OBJECT
        // //write audio into temp directory because putting it in data result in a memory overflow
        // //getting buffer from audio file
        // new Response(audio_file).arrayBuffer().then(async result => {
        //     audio_buffer = result;

        //     CustomLog("info",`file type: ${audio_file.type}`)
        //     //requesting file write
        //     await ipcRenderer.invoke("write-audio-to-temp", new Uint8Array(audio_buffer), audio_file_type);

        //     //send required data to the renderer
        //     await ipcRenderer.invoke("send-event-to-export-win", "data-sent", data);
        // });



        //track progress
        var start = performance.now();

        //reset
        document.getElementById("export_frame_span").innerHTML = "";
        document.getElementById("export_frame_progress").style.width = "0%";
        document.getElementById("export_encoding_span").innerHTML = "";
        document.getElementById("export_encoding_progress").style.width = "0%";

        //events
        ipcRenderer.on("export-progress", (event, max, progress) => {
            //progress display
            document.getElementById("export_frame_span").innerHTML = `${progress}/${max}`;
            document.getElementById("export_frame_progress").style.width = `${progress/max*100}%`;
            max_frames = max;

            //time estimation
            let now = performance.now();
            let ellapsed = now-start;
            //estimate the total time it will take based on the ellapsed time,
            //the number of frames rendered and the total number of frames
            //to render, using proportionality.
            //This works because most frames usually takes the same amount of time to render.
            let total_estimation = (ellapsed/progress)*max;
            let time_left_estimation = total_estimation-ellapsed;
            let hours = Math.floor(time_left_estimation/3600000);// /1000/60/60
            let mins = Math.floor((time_left_estimation/60000)%60);// /1000/60
            let secs = Math.floor((time_left_estimation/1000)%60);
            mins = (mins<10)? "0"+mins : mins;
            secs = (secs<10)? "0"+secs : secs;

            document.getElementById("export_frame_time_span").innerHTML = `${hours}:${mins}:${secs}`;
        });
        ipcRenderer.once("frames-rendered", (event) => {
            ipcRenderer.removeAllListeners("export-progress");
        });

        ipcRenderer.on("encoding-progress", (event, info) => {
            //progress display
            document.getElementById("export_encoding_span").innerHTML = `${info.frames}/${max_frames+1}`;
            document.getElementById("export_encoding_progress").style.width = `${info.frames/(max_frames+1)*100}%`;

            //time estimation
            let now = performance.now();
            let ellapsed = now-start;
            //estimate the total time it will take based on the ellapsed time,
            //the number of frames rendered and the total number of frames
            //to render, using proportionality.
            //This works because most frames usually takes the same amount of time to render.
            let total_estimation = (ellapsed/info.frames)*(max_frames+1);//ffmpeg renders one more frame
            let time_left_estimation = total_estimation-ellapsed;
            let hours = Math.floor(time_left_estimation/3600000);// /1000/60/60
            let mins = Math.floor((time_left_estimation/60000)%60);// /1000/60
            let secs = Math.floor((time_left_estimation/1000)%60);
            mins = (mins<10)? "0"+mins : mins;
            secs = (secs<10)? "0"+secs : secs;

            document.getElementById("export_encoding_time_span").innerHTML = `${hours}:${mins}:${secs}`;
        });
        ipcRenderer.once("encoding-finished", (event, success) => {
            ipcRenderer.removeAllListeners("encoding-progress");
            if (success) {
                let now = performance.now();
                let ellapsed = now-start;
                let hours = Math.floor(ellapsed/3600000);// /1000/60/60
                let mins = Math.floor((ellapsed/60000)%60);// /1000/60
                let secs = Math.floor((ellapsed/1000)%60);
                mins = (mins<10)? "0"+mins : mins;
                secs = (secs<10)? "0"+secs : secs;

                MessageDialog("info",`The video has been successfully created in ${hours}:${mins}:${secs} !`);
                CustomLog('info',`The video has been successfully created in ${hours}:${mins}:${secs} !`);
            }
            else MessageDialog("error","An error occurred during the encoding process. For more information, see the logs.");
        });

    });

}