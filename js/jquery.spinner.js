(function($){
	if($){
		$.fn.spinner = function(opts, val){
			if(typeof opts == 'string'){
				switch(opts){
					case 'value':
						this.each(function(){
							var settings = this._jquery_spinner_settings;
							var canvas = $(this).find('canvas').get(0);

							if(settings.animate){
								var oldvalue = settings.value;

								_jquery_spinner_draw(canvas, settings, oldvalue); // initial frame drawn with no value

								settings.value = val;
								this._jquery_spinner_settings.value = val;

								$({ val: oldvalue }).animate({ val: settings.value }, {
									duration: settings.speed,
									easing: settings.easing,
									step: function(now, tween){
										settings._text = settings.updateText(now, settings);
										settings.step(); // step callback
										_jquery_spinner_draw(canvas, settings, now); // subsequent frames
									},
									complete: settings.complete,
									start: settings.start
								});
							}else{
								_jquery_spinner_draw(canvas, settings, settings.value);
							}
						});
					break;
					default:
						// try to set the property to the value
						this.each(function(){
							var canvas = $(this).find('canvas').get(0);
							
							this._jquery_spinner_settings[opts] = val;
							_jquery_spinner_draw(canvas, this._jquery_spinner_settings, this._jquery_spinner_settings.value);
						});
					break;
				}
			}else{
				var settings = $.extend({
					size: 200,
					start: 0,
					min: 0,
					max: 10,
					value: 5,
					background: '#CCCCCC',
					foreground: '#AAAAAA',
					backgroundStroke: '#000000',
					foregroundStroke: '#000000',
					backgroundStrokeWidth: 0,
					foregroundStrokeWidth: 0,
					center: 'transparent',
					border: '30',
					animate: false,
					speed: 'medium',
					easing: 'swing',
					complete: function(){},
					step: function(){},
					updateText: function(value, settings){
						return Math.round(value);
					},
					_text: '',
					anticlockwise: 0
				}, opts);

				window._jquery_spinner_degtorad = function(degrees){
					// converts degrees from North into Radians from east
					return ((degrees - 90) + settings.start) * Math.PI / 180;
				}

				window._jquery_spinner_pie = function(min, max, value){
					return (value - min) / (max - min) * 360;
				}

				window._jquery_spinner_draw = function(canvas, settings, val){
					var ctx = canvas.getContext('2d');
					ctx.clearRect(0, 0, canvas.width, canvas.height);

					if(settings.center.toLowerCase() != 'transparent'){
						ctx.beginPath();
						ctx.arc(canvas.width / 2, canvas.height / 2, (settings.size / 2) - settings.border, _jquery_spinner_degtorad(0), _jquery_spinner_degtorad(360), settings.anticlockwise);
						ctx.fillStyle = settings.center;
						ctx.fill();
					}

					if(settings.background.toLowerCase() != 'none'){
						ctx.beginPath();
						ctx.arc(canvas.width / 2, canvas.height / 2, settings.size / 2, _jquery_spinner_degtorad(0), _jquery_spinner_degtorad(360), settings.anticlockwise);
						// if(settings.center.toLowerCase() == 'transparent'){
							ctx.arc(canvas.width / 2, canvas.height / 2, settings.size / 2 - settings.border, _jquery_spinner_degtorad(360), _jquery_spinner_degtorad(0), 1 - settings.anticlockwise);
						// }
						ctx.fillStyle = settings.background;
						ctx.fill();

						if(settings.backgroundStroke.toLowerCase() != 'transparent' && settings.backgroundStrokeWidth != 0){
							ctx.strokeStyle = settings.backgroundStroke;
							ctx.lineWidth = settings.backgroundStrokeWidth;
							ctx.stroke();
						}
					}

					if(settings.foreground.toLowerCase() != 'none'){
						ctx.beginPath();
						// if(settings.center.toLowerCase() != 'transparent'){
							ctx.moveTo(canvas.width / 2, canvas.height / 2);
						// }
						ctx.arc(canvas.width / 2, canvas.height / 2, settings.size / 2, _jquery_spinner_degtorad(0), _jquery_spinner_degtorad(_jquery_spinner_pie(settings.min, settings.max, val)), settings.anticlockwise);
						// if(settings.center.toLowerCase() == 'transparent'){
							ctx.arc(canvas.width / 2, canvas.height / 2, settings.size / 2 - settings.border, _jquery_spinner_degtorad(_jquery_spinner_pie(settings.min, settings.max, val)), _jquery_spinner_degtorad(0), 1 - settings.anticlockwise);
							ctx.lineTo((canvas.width / 2) + (settings.size / 2) * Math.cos(_jquery_spinner_degtorad(0)), (canvas.height / 2) + (settings.size / 2) * Math.sin(_jquery_spinner_degtorad(0)));
						// }
						ctx.fillStyle = settings.foreground;
						ctx.fill();

						if(settings.foregroundStroke.toLowerCase() != 'transparent' && settings.foregroundStrokeWidth != 0){
							ctx.strokeStyle = settings.foregroundStroke;
							ctx.lineWidth = settings.foregroundStrokeWidth;
							ctx.stroke();
						}
					}

					var $span = $(canvas).siblings('.caption').find('.inner');
					$span.text(settings._text);
				}

				this.each(function(){
					this._is_jquery_spinner = true;
					this._jquery_spinner_settings = settings;

					var canvas = document.createElement('canvas');
					canvas.width = settings.size + Math.max(settings.foregroundStrokeWidth * 2, settings.backgroundStrokeWidth * 2);
					canvas.height = canvas.width;

					if(settings.animate){
						_jquery_spinner_draw(canvas, settings, settings.min); // initial frame drawn with no value
						$({ val: settings.min }).animate({ val: settings.value }, {
							duration: settings.speed,
							easing: settings.easing,
							step: function(now, tween){
								settings._text = settings.updateText(now, settings);
								settings.step(); // step callback
								_jquery_spinner_draw(canvas, settings, now); // subsequent frames
							},
							complete: settings.complete,
							start: settings.start
						});
					}else{
						_jquery_spinner_draw(canvas, settings, settings.value);
					}

					$(canvas).appendTo(this);
					$('<span class="caption"><span class="inner"></span></span>').css({
						width: settings.size - settings.border * 2,
						height: settings.size - settings.border * 2,
						marginLeft: -(settings.size - settings.border * 2) / 2,
						marginTop: -(settings.size - settings.border * 2) / 2,
						borderRadius: '50%'
					}).appendTo(this);

					$(this).addClass('jquery-spinner');
				});
}
		}
	}else{
		if(console){
			console.log('jQuery not detected');
		}
	}
})(window.jQuery || null);