new Vue({
    el: '#main',
    data: {
        name: "Habanero",
        seen: false,
        greeting: "Hello",
        animals: [],
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        chosenimage: location.hash.slice(1)
    },
    mounted: function() {
        var me = this;
        axios.get('/images').then(function(response) {
            // console.log("response from /images", response.data);
            me.images = response.data;
            me.scrollImg();
        }).catch(err =>{
            console.log("error in getimages: ", err);
        });
        window.addEventListener("hashchange", function(){
            me.chosenimage = location.hash.slice(1);
        });
    },
    methods: {
        myFunction: function(animalClickedOn) {
            console.log("myFunction is running");
            console.log("animalClickedOn: ", animalClickedOn);
            this.name = animalClickedOn;
        },
        handleClick: function(e){
            let me = this;
            e.preventDefault();
            console.log("this: ", this.title);
            var fd = new FormData; // this is used because the user is sending a file. when you have text only to be sent, we dont need this
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            fd.append("file", this.file);
            axios.post("/upload", fd).then(function(res){ //the post request cn have two arguments
                console.log("res.data: ", res.data);
                me.images.unshift(res.data.image);
                console.log("res in image upload: ", res);
            }).catch(function(err){
                console.log("error in image upload: ", err);
            });
        },
        handleChange: function(e){
            console.log("change is happening"); //appears when I change something, or upload an image
            console.log("e.target.files[0]: ", e.target.files[0]); //
            this.file = e.target.files[0];

        },
        changeGreeting: function(){
            this.greeting = "HOLA!";
        },
        sayGoodbye: function(){
            this.greeting = "bye,bye";
        },
        closeModal: function(){
            // this.chosenimage = null;
            location.hash = "";
        },
        modal: function(id){
            this.chosenimage = id;
            console.log("modal-id: ", this.chosenimage);
        }
        ,
        scrollImg: function(){
            var me = this;
            window.onscroll = () => {
                let bottom = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                var lastId = me.images[me.images.length - 1].id;
                if (bottom) {
                    console.log("bottomOfWindow, ", bottom);
                    // Do something, anything!
                    axios.get('/images/' + lastId).then(function(response) {
                        me.images = me.images.concat(response.data);
                    }).catch(function(err){
                        console.log("error in image upload: ", err);
                    });
                }
            };
        },

        // ,
        // setCurrentImage: function(e) {
        //     console.log("e.target.id is", e.target.id[0]);
        //     this.id = e.target.id[0];
        // }
    }
});
// this send a json body to the form
// axios.post("/comment"){
//     username: this.username,
//     id: this.id,
//     comment: this.comment
// })
//this applied to mounted

// addEventListener("hashchange",);




// });
