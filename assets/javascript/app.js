App = {
	init: function(){
		this.bindEvents();
		this.firebase = new Firebase("https://jiviapp.firebaseio.com/users/");
	},
	isValid : function(a, b){
		if (b === "username")
			return /^[a-zA-Z0-9]+$/.test(a);
		
		return /^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/.test(a) && /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$).*/.test(a);
	},
	bindEvents: function(){
		$(".form .field input[type='text']").on("focus", function(){
			var label = $(this).attr("data-icon-label");

			// make icon fade in beautifly
			if (label === "username" && $(".icon-username").hasClass("hidden"))
				$(".icon-username").removeClass("hidden").addClass("animated fadeInLeft");
			else if (label === "email" && $(".icon-email").hasClass("hidden"))
				$(".icon-email").removeClass("hidden").addClass("animated fadeInLeft");

			// resize left padding
			$(this).addClass("smaller");

			// remove placeholder attribute
			$(this).attr("placeholder", "");
		})
		.on("focusout", function(){
			var val = $(this).val(),
				label = $(this).attr("data-icon-label");

			if (val === ""){
				// hide icon
				if (label === "username")
					$(".icon-username").addClass("hidden").removeClass("fadeInLeft");
				else if (label === "email")
					$(".icon-email").addClass("hidden").removeClass("fadeInLeft");

				// resize left padding back to original state
				$(this).removeClass("smaller");

				// remove placeholder attribute
				$(this).attr("placeholder", $(this).attr("data-placeholder"));
			}
		});

		$(".form button.reserve-spot").on("click", function(){
			var username = $(".form input.username").val(),
				email = $(".form input.email").val(),
				usernameIsValid = App.isValid(username, "username"),
				emailIsValid = App.isValid(email, "email"),
				animationType = "flash";

			var onValidationError = function (fieldType, text){
				var errorImg = (fieldType === "username" ? "assets/images/username_wrong.svg" : "assets/images/email_wrong.svg");
				
				$(".form ." + fieldType + "_field img").attr("src", errorImg);
				$(".form ." + fieldType + "_field input").addClass("found_error");
				$(".form ." + fieldType + "_field input").val("");
				$(".form ." + fieldType + "_field input").attr("placeholder", text);
			};

			if (!usernameIsValid)
				onValidationError("username", "USERNAME IS INVALID");

			if (!emailIsValid)
				onValidationError("email", "EMAIL IS INVALID");

			setTimeout(function(){
				$(".form input.username").removeClass(animationType);
				$(".form input.email").removeClass(animationType);
			}, 1500); 

			if (usernameIsValid && emailIsValid){
				App.firebase.child(username).once('value', function(e) {
					if (!e.val()) {
						App.firebase.child(username).set({
							email: email,
							created_at: new Date()
						}, function(error){
							if (!error){
								$(".background").attr("id", "success");

								$(".headline.default").text("HOWDY!");
								$(".text.default").text("@" + username + " is reserved for you!");

								$("" +
									"<div class='cta default social'>" +
										"<p>Share Jivi with your friends:</p>" +
										"<p class='share clearfix'>" +
											"<a href='https://twitter.com/share?url=http://www.jivi.tv' class='clearfix' target='_blank'><img src='assets/images/twitter_default.svg' /></a>" +
											"<a href='http://www.facebook.com/sharer/sharer.php?u=http://www.jivi.tv' class='clearfix' target='_blank'><img src='assets/images/facebook_default.svg' /></a>" +
											"<a href='https://plus.google.com/share?url=http://www.jivi.tv' class='clearfix' target='_blank'><img src='assets/images/googleplus_default.svg' /></a>" +			
										"</p>" +
									"</div>" +
								"").insertAfter(".form.default");
								$(".form.default").remove();
							}
						});
					}
				    else {
				    	onValidationError("username", "USERNAME EXISTS");
				    }
				});
			}
		})

		$(".form input").on("keyup", function(){
			$(this).removeClass("found_error");
		});

		if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) {
			$(".bottom").on("mouseover", function(){
				var src = $("a[data-action='toggle_hiring'] img").attr("src");

				$("a[data-action='toggle_hiring'] img").attr("src", src.replace("_white", "_yellow"));
			})
			.on("mouseout", function(){
				var src = $("a[data-action='toggle_hiring'] img").attr("src");

				$("a[data-action='toggle_hiring'] img").attr("src", src.replace("_yellow", "_white"));
			});
		}

		$("a[data-action='toggle_hiring']").addClass("animated bounceInUp");

		$(document).on("mouseover", ".cta .share a", function(){
			var src = $(this).children("img").attr("src");

			$(this).children("img").attr("src", src.replace("_default", "_hover"));
		})
		.on("mouseout", ".cta .share a", function(){
			var src = $(this).children("img").attr("src");

			$(this).children("img").attr("src", src.replace("_hover", "_default"));
		});
	}
};

$(document).ready(function(){
	App.init();
});