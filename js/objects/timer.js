//MIT License - Copyright (c) 2020-2021 Picorims

//TIMER OBJECT PROCESS

/*data = {
    object_type: "timer",
    id: ?, (UUID)
    name: ?, (string)
    layer: ?, (integer)
    x: ?, (px)
    y: ?, (px)
    width: ?, (px)
    height: ?, (px)
    rotation: ?, (deg)
    type: ("bar"||"point"),
    color: ?, (string: hex, rgb, rgba)
    border_to_bar_space: ?, (px)
    border_thickness: ?, (px)
    border_radius: ?, (string, css border-radius)
    box_shadow: ?, (string, css box-shadow)
}*/

function Timer(glob_data) {
    if (imports.utils.IsUndefined(glob_data)) throw "Timer: data missing!";

    this.data = glob_data;//collect data
    this.data.object_type = "timer";
    objects.push(this);//add the object to the list

    //default values
    this.DEFAULTS = {
        NAME: this.data.object_type,
        LAYER: 0,
        X: 0,
        Y: 0,
        WIDTH: 100,
        HEIGHT: 10,
        ROTATION: 0,
        TYPE: "bar",
        COLOR: "#ffffff",
        BORDER_TO_BAR_SPACE: 2,
        BORDER_THICKNESS: 2,
        BORDER_RADIUS: "",
        BOX_SHADOW: "",
    };


    //########################################
    //VERIFY RECEIVED DATA, SET DEFAULT VALUES
    //########################################

    //Note: ignore_undefined is useful when we only want to verify the given values without setting any default value
    //(invalid data is still overwritten)

    this.verifyData = function(data, ignore_undefined) {
        if (imports.utils.IsUndefined(data)) throw "Timer.verifyData: data missing!";
        if ( !imports.utils.IsUndefined(ignore_undefined) && !(ignore_undefined === "IGNORE_UNDEFINED") ) throw "Timer.verifyData: IGNORE_UNDEFINED is the only valid node.";


        if ( imports.utils.IsUndefined(ignore_undefined) ) ignore_undefined = "";

        //ID
        if ( imports.utils.IsUndefined(data.id) || !imports.utils.IsAString(data.id) || !object_method.validID(data.id, this) ) {
            CustomLog("error","Timer object: received an object with an unspecified/invalid ID! A random ID is given.");
            data.id = object_method.generateID();
        }

        //name
        if ( imports.utils.IsUndefined(data.name) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.name = this.DEFAULTS.NAME;}
        if ( !imports.utils.IsUndefined(data.name) && !imports.utils.IsAString(data.name) || data.name === "" ) {
            CustomLog("warn",`Timer object: Invalid name! Set to '${this.DEFAULTS.NAME}'.`);
            data.name = this.DEFAULTS.NAME;
        }

        //layer
        if ( imports.utils.IsUndefined(data.layer) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.layer = this.DEFAULTS.LAYER;}
        if ( !imports.utils.IsUndefined(data.layer) && (!imports.utils.IsAnInt(data.layer) || (data.layer <= -1)) ) {
            CustomLog("warn",`Timer object: Invalid layer! Set to ${this.DEFAULTS.LAYER}.`);
            data.layer = this.DEFAULTS.LAYER;
        }

        //x
        if ( imports.utils.IsUndefined(data.x) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.x = this.DEFAULTS.X;}
        if ( !imports.utils.IsUndefined(data.x) && !imports.utils.IsAnInt(data.x) ) {
            CustomLog("warn",`Timer object: Invalid x coordinate! Set to ${this.DEFAULTS.X}.`);
            data.x = this.DEFAULTS.X;
        }

        //y
        if ( imports.utils.IsUndefined(data.y) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.y = this.DEFAULTS.Y;}
        if ( !imports.utils.IsUndefined(data.y) && !imports.utils.IsAnInt(data.y) ) {
            CustomLog("warn",`Timer object: Invalid y coordinate! Set to ${this.DEFAULTS.Y}.`);
            data.y = this.DEFAULTS.Y;
        }

        //width
        if ( imports.utils.IsUndefined(data.width) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.width = this.DEFAULTS.WIDTH;}
        if ( !imports.utils.IsUndefined(data.width) && (!imports.utils.IsAnInt(data.width) || (data.width < 0)) ) {
            CustomLog("warn",`Timer object: Invalid width! Set to ${this.DEFAULTS.WIDTH}.`);
            data.width = this.DEFAULTS.WIDTH;
        }

        //height
        if ( imports.utils.IsUndefined(data.height) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.height = this.DEFAULTS.HEIGHT;}
        if ( !imports.utils.IsUndefined(data.height) && (!imports.utils.IsAnInt(data.height) || (data.height < 0)) ) {
            CustomLog("warn",`Timer object: Invalid height! Set to ${this.DEFAULTS.HEIGHT}.`);
            data.height = this.DEFAULTS.HEIGHT;
        }

        //rotation
        if ( imports.utils.IsUndefined(data.rotation) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.rotation = this.DEFAULTS.ROTATION;}
        if ( !imports.utils.IsUndefined(data.rotation) && !imports.utils.IsAnInt(data.rotation) ) {
            CustomLog("warn",`Timer object: Invalid rotation! Set to ${this.DEFAULTS.ROTATION}.`);
            data.rotation = this.DEFAULTS.ROTATION;
        }

        //type
        if ( imports.utils.IsUndefined(data.type) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.type = this.DEFAULTS.TYPE;}
        if ( !imports.utils.IsUndefined(data.type) && (!imports.utils.IsAString(data.type) || ( (data.type !== "bar") && (data.type !== "point") )) ) {
            CustomLog("warn",`Timer object: Invalid type! Set to ${this.DEFAULTS.TYPE}.`);
            data.type = this.DEFAULTS.TYPE;
        }

        //color
        if ( imports.utils.IsUndefined(data.color) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.color = this.DEFAULTS.COLOR;}
        if ( !imports.utils.IsUndefined(data.color) && !imports.utils.IsAString(data.color) ) {
            CustomLog("warn",`Timer object: Invalid color! Set to ${this.DEFAULTS.COLOR}.`); //do not detect css errors!
            data.color = this.DEFAULTS.COLOR;
        }

        //border to bar space
        if ( imports.utils.IsUndefined(data.border_to_bar_space) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.border_to_bar_space = this.DEFAULTS.BORDER_TO_BAR_SPACE;}
        if ( !imports.utils.IsUndefined(data.border_to_bar_space) && (!imports.utils.IsAnInt(data.border_to_bar_space) || (data.border_to_bar_space < 0)) ) {
            CustomLog("warn",`Timer object: Invalid border to bar space! Set to ${this.DEFAULTS.BORDER_TO_BAR_SPACE}.`);
            data.border_to_bar_space = this.DEFAULTS.BORDER_TO_BAR_SPACE;
        }

        //border thickness
        if ( imports.utils.IsUndefined(data.border_thickness) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.border_thickness = this.DEFAULTS.BORDER_THICKNESS;}
        if ( !imports.utils.IsUndefined(data.border_thickness) && (!imports.utils.IsAnInt(data.border_thickness) || (data.border_thickness < 0)) ) {
            CustomLog("warn",`Timer object: Invalid border thickness! Set to ${this.DEFAULTS.BORDER_THICKNESS}.`);
            data.border_thickness = this.DEFAULTS.BORDER_THICKNESS;
        }

        //border-radius
        if ( imports.utils.IsUndefined(data.border_radius) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.border_radius = this.DEFAULTS.BORDER_RADIUS;}
        if ( !imports.utils.IsUndefined(data.border_radius) && !imports.utils.IsAString(data.border_radius) ) {
            CustomLog("warn",`Timer object: Invalid border-radius! Set to "${this.DEFAULTS.BORDER_RADIUS}".`); //do not detect css errors!
            data.border_radius = this.DEFAULTS.BORDER_RADIUS;
        }

        //box-shadow
        if ( imports.utils.IsUndefined(data.box_shadow) && !(ignore_undefined === "IGNORE_UNDEFINED") ) {data.box_shadow = this.DEFAULTS.BOX_SHADOW;}
        if ( !imports.utils.IsUndefined(data.box_shadow) && !imports.utils.IsAString(data.box_shadow) ) {
            CustomLog("warn",`Timer object: Invalid box-shadow! Set to "${this.DEFAULTS.BOX_SHADOW}".`); //do not detect css errors!
            data.box_shadow = this.DEFAULTS.BOX_SHADOW;
        }

        return data;

    }

    this.data = this.verifyData(this.data);




    



    //###################################
    //FUNCTION TO APPLY DATA TO THE TIMER
    //###################################

    this.updateData = function(data) {
        if (imports.utils.IsUndefined(data)) throw "Timer.updateData: data missing!";
        //NOTE: it is NOT possible to change the timer type (data.type) and id (data.id). A new timer must be created in such case!

        if ( imports.utils.IsUndefined(data.id) ) {
            CustomLog("error","Timer object: No ID specified!");
            return;
        }

        if (data.id === this.data.id) {//if he is the targeted element (remove executes for all objects!)
            //LOAD DATA
            this.data_backup = JSON.parse(JSON.stringify(this.data)); //keep a copy of the existing data
            this.data = data;//recollect data
            this.data.object_type = "timer";

            //VERIFY DATA
            this.data = this.verifyData(this.data, "IGNORE_UNDEFINED");

            //APPLY DATA
            this.data = object_method.mergeData(this.data, this.data_backup); //simple assignement would overwrite existing data
            this.element.style.zIndex = this.data.layer;//layer
            this.element.style.width = this.data.width+"px";//width
            if (this.data.type === "bar") this.element.style.height = this.data.height+"px";//height
            this.element.style.left = this.data.x+"px";//x
            this.element.style.top = this.data.y+"px";//y
            this.element.style.transform = `rotate(${this.data.rotation}deg)`;//rotation
            this.element.style.border = `${this.data.border_thickness}px solid ${this.data.color}`;//color, border_thickness
            this.element.style.borderRadius = this.data.border_radius;//border_radius
            this.element.style.boxShadow = this.data.box_shadow;//box_shadow



            //APPLY DATA TO CHILD ELEMENT
            var child = this.element.child;
            child.style.zIndex = this.data.layer;//layer
            child.style.backgroundColor = this.data.color;//color
            child.style.boxShadow = this.data.box_shadow;//box_shadow

            if (this.data.type === "bar") {
                child.style.top = this.data.border_to_bar_space + "px";
                child.style.left = this.data.border_to_bar_space + "px";
                child.style.width = (this.data.width - 2*this.data.border_to_bar_space) + "px";//width
                child.style.height = (this.data.height - 2*this.data.border_to_bar_space) + "px";//height
                child.style.borderRadius = this.data.border_radius;//border_radius
            } else if (this.data.type === "point") {
                child.style.top = -(this.data.height/2) + "px";
                child.style.left = -(this.data.height/2) + "px";
                child.style.width = this.data.height + "px";
                child.style.height = this.data.height + "px";//height
                child.style.borderRadius = (this.data.height/2) + "px";//border_radius
            }

        }


        //END OF updateData();
    }




    //###################
    //CREATE HTML ELEMENT
    //###################

    //canvas or div depending of the context
    this.element = document.createElement("div");

    //basic parameters
    screen.appendChild(this.element);
    this.element.style.position = "absolute";
    this.element.style.display = "inline-block";

    //child
    this.element.child = document.createElement("div");
    this.element.appendChild(this.element.child)
    this.element.child.style.position = "absolute";
    this.element.child.style.display = "inline-block";



    //#############################
    //APPLY DATA FOR THE FIRST TIME
    //#############################
    this.updateData(this.data);




    //#####################
    //CREATE USER INTERFACE
    //#####################
    if (!export_mode) {

        //create category
        this.parameter_container = new imports.ui_components.UIParameterRack(tab.objects, `UI-${this.data.id}`, this.data.name, '<i class="ri-timer-2-line"></i>', {
            default_closed: true,
        });
        this.parameter_container.delete_callback = () => {
            this.remove(this.data.id);
        }
        this.parameter_container.rename_callback = () => {
            InputDialog("Enter a new name for the object:", (result) => {
                this.updateData({id: this.data.id, name: result});
                this.parameter_container.rename(result);
            });
        }

        //layer
        AddParameter(
            {
                object_id: this.data.id,
                type: "value",
                settings: {
                    default: this.data.layer,
                    min: 0,
                    step: 1,
                },
                title: "Layer",
                help: help.parameter.object.general.layer,
            },
            function(id, value) {   //id, type, parameters, name, callback with id
                                                                                                    //and returned value by the input
                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    layer: value,
                });
            }
        );

        //x and y
        AddParameter(
            {
                object_id: this.data.id,
                type: "value-xy",
                settings: {
                    default_x: this.data.x,
                    default_y: this.data.y,
                    step: 1,
                },
                title: "Coordinates",
                help: help.parameter.object.general.pos,
            },
            function(id, value1, value2) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    x: value1,
                    y: value2,
                });
            }
        );

        //width and height
        AddParameter(
            {
                object_id: this.data.id,
                type: "value-xy",
                settings: {
                    default_x: this.data.width,
                    default_y: this.data.height,
                    min: 0,
                    step: 1,
                },
                title: "Width and Height",
                help: help.parameter.object.general.size,
            },
            function(id, value1, value2) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    width: value1,
                    height: value2,
                });
            }
        );

        //rotation
        AddParameter(
            {
                object_id: this.data.id,
                type: "value",
                settings: {
                    default: this.data.rotation,
                    min: 0,
                    step: 1,
                },
                title: "Rotation (degrees)",
                help: help.parameter.object.general.rotation,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    rotation: value,
                });
            }
        );

        //color
        AddParameter(
            {
                object_id: this.data.id,
                type: "string",
                settings: {
                    default: this.data.color,
                },
                title: "Color",
                help: help.parameter.object.general.color,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    color: value,
                });
            }
        );

        //border to bar space
        AddParameter(
            {
                object_id: this.data.id,
                type: "value",
                settings: {
                    default: this.data.border_to_bar_space,
                    min: 0,
                    step: 1,
                },
                title: "Space between the border and the bar",
                help: help.parameter.object.timer.space_between,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    border_to_bar_space: value,
                });
            }
        );

        //border thickness
        AddParameter(
            {
                object_id: this.data.id,
                type: "value",
                settings: {
                    default: this.data.border_to_bar_space,
                    min: 0,
                    step: 1,
                },
                title: "Border thickness",
                help: help.parameter.object.timer.border_thickness,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    border_thickness: value,
                });
            }
        );

        //border-radius
        AddParameter(
            {
                object_id: this.data.id,
                type: "string",
                settings: {
                    default: this.data.border_radius,
                },
                title: "Border Radius",
                help: help.parameter.object.general.border_radius,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    border_radius: value,
                });
            }
        );

        //box-shadow
        AddParameter(
            {
                object_id: this.data.id,
                type: "string",
                settings: {
                    default: this.data.box_shadow,
                },
                title: "Box Shadow",
                help: help.parameter.object.general.shadow,
            },
            function(id, value) {

                var this_object = object_method.getByID(id);

                this_object.updateData({
                    id: id,
                    box_shadow: value,
                });
            }
        );
    }





    //############################
    //FUNCTION TO ANIMATE THE TEXT
    //############################

    this.update = function() {
        if (this.data.type === "bar") {
            this.element.child.style.width = ( (this.data.width - 2*this.data.border_to_bar_space) * (current_time / audio_duration) ) + "px";
        } else if (this.data.type === "point") {
            this.element.child.style.left = ( -(this.data.height/2) + this.data.width * (current_time / audio_duration) ) + "px";
        }

        //finished updating
        return true;
    }



    //###########################
    //FUNCTION TO REMOVE THE TEXT
    //###########################

    this.remove = function(id) {
        if (!imports.utils.IsAString(id)) throw `Timer.remove: ${id} is not a valid ID.`;

        if (this.data.id === id) {//if he is the targeted element (remove executes for all objects!)
            //remove index
            var index = objects.indexOf(this);
            objects.splice(index, 1);

            //remove element
            this.element.remove();
        }
    }


    //END OF THE OBJECT
}