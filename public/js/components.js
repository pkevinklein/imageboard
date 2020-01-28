Vue.component("image-modal", {
    // template: `<h2>helloooo</h2>`
    template: `#my-template`,
    data: function (){
        return{
            subGreeting: "yo!",
            image: {},
            comments: [],
            comment:"",
            username: ""
        };
    },
    props: ["chosenimage"],
    mounted: function(){
        var me = this;
        console.log("me.chosenimage: ", me.chosenimage);
        axios.get(`/modal/${this.chosenimage}`).then(function(response) {
            console.log("response from /modal: ", response.data);
            me.image = response.data.image;
            me.comments = response.data.comments;
        }).catch(err =>{
            console.log("error in modal/chosenimage: ", err);
        });
    },
    watch: {
        chosenimage: function (){
            var me = this;
            console.log("me: ", me);
            axios.get(`/modal/${this.chosenimage}`).then(function(response) {
                console.log("response from /modal: ", response.data);
                me.image = response.data.image;
                me.comments = response.data.comments;
            }).catch(err =>{
                console.log("error in HASHmodal/chosenimage: ", err);
            });
        }
    },
    methods: {
        changeSubGreeting: function(){
            this.subGreeting = "nice to see you";
        },
        sendMessageToParent: function(){
            this.$emit("goodbye");
        },
        closeModal: function(){
            this.$emit("close");
        },
        handleComments: function(e){
            let me = this;
            e.preventDefault();
            var obj = {
                username: me.username,
                comment: me.comment,
                id: me.chosenimage
            };
            // console.log("obj.chosenimage: ", obj.chosenimage);
            axios.post("/modal/comment", obj).then(function(res){ //the post request cn have two arguments
                console.log("res.data in comment: ", res.data);
                me.comments.unshift(res.data[0]);
                // console.log("res in comment upload: ", res);
            }).catch(err => {
                console.log("error in comment upload: ", err);
            });
        }
    }
});
