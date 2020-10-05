var socket = io();
function doComment(form){
		var formComment = {comment_id: form.comment_id.value,user_name: form.user_name.value,message: form.message.value};
		socket.emit("new_comment", formComment);
}

var datetime = moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')
var ago = moment().utcOffset("+05:30").fromNow();

socket.on("new_comment", comment=>{
	if(comment.comment_id!=$("#comment_id").val()){
		return;
	}
	var html = "";
		html+=`<div class="row">`
		html+=`<div class="col-md-12">`
		html+=`<strong class="username">`
		html+=comment.user_name
		html+=`</strong>`
		html+=`<span class="float-right badge badge-pill badge-dark">`
		html+=ago
		html+=`</span>`
		html+=`<p class="mb-0">`
		html+=comment.message
		html+=`</p>`
		html+=`<span class="float-right badge badge-pill badge-dark">`
		html+=datetime
		html+=`</span>`
		html+=`<hr>`
		html+=`</div>`
		html+=`</div>`
		$(".comnt").append(html);
		var scroll = document.getElementById('scroll');
		scroll.scrollTop = scroll.scrollHeight;
})

function web(){
	socket.emit("messageSent",{
		"user_name": document.getElementById("user_name").value,
		"message": document.getElementById("message").value
	})
}

socket.on("messageSent",function(message){
	$.notify("New Comment: " + message.message + "\n\nFrom: " + message.user_name,{
		autoHide: false,
		className: "info"
	})
})