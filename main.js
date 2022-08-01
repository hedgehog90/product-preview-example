// CONFIG
var color_map = {
	"bright yellow": "#f8dc0d",
	"light orange": "#f8971f",
	"orange": "#f14a27",
	"strawberry red": "#c62429",
	"burgundy red": "#690f22",
	"rose pink": "#f486b4",
	"fuchsia pink": "#d92d6c",
	"leaf green": "#50b349",
	"moss green": "#1e443c",
	"mint green": "#6cc7b6",
	"light turquoise": "#16a9a5",
	"ice blue": "#70afe0",
	"ocean blue": "#2b90c5",
	"jeans blue": "#284584",
	"dark blue": "#2a2e6a",
	"berry blue": "#202a4d",
	"violet": "#6f3185",
	"nut brown": "#452527",
	"leather brown": "#9e4926",
	"pearl grey": "#c6c4c7",
	"cement grey": "#878b8f",
	"basalt grey": "#565e64",
	"beige": "#ecde9a",
	"jet black": "#070707",
	"bright white": "#ffffff",
	"metallic silver": "#acbccb",
	"metallic gold": "#958c54",
}
var base_url = `./images/R51_1024x1024_2_0003_R51_1024x1024.png`;
var option_map = {
	"Branches & Birds Colour": 	{url:"./images/R51_1024x1024_2_0002_Layer-1.png", default:"basalt grey"},
	"Flowers Colour": 			{url:"./images/R51_1024x1024_2_0001_Layer-2.png", default:"light orange"},
	"Flowers 2 Colour": 		{url:"./images/R51_1024x1024_2_0000_Layer-3.png", default:"orange"},
}

// RENDERER

(async()=>{

	var images = {};
	await Promise.all([base_url, ...Object.values(option_map).map(({url})=>url)].map((url)=>{
		return new Promise((resolve)=>{
			var img = new Image();
			img.src = url;
			// img.crossOrigin = "anonymous";
			img.onload = resolve;
			images[url] = img;
		});
	}));

	function capitalize(s) {
		return s.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
	}

	var main = document.querySelector(".main");
	var img_container = document.querySelector(".img_container");
	var loading = document.querySelector(".loading");
	var option_container = document.querySelector(".option_container");
	main.style.display="";
	loading.remove()

	for (var k in option_map) {
		var label = $(`<label>${k}: </label>`)[0];
		var select = $(`<select id="${k}">`)[0];
		label.append(select);
		option_container.append(label);
		for (var c in color_map) {
			var opt = $(`<option value="${c}">${capitalize(c)}</option>`)[0];
			select.append(opt);
		}
		select.value = option_map[k].default;
		select.addEventListener("change", ()=>{
			render();
		})
	}

	/** @type {HTMLCanvasElement} */
	var canvas = $(`<canvas>`)[0];
	canvas.width = images[base_url].width;
	canvas.height = images[base_url].height;
	var ctx = canvas.getContext('2d');
	img_container.append(canvas);
	
	var buffer = $(`<canvas>`)[0];
	buffer.width = canvas.width;
	buffer.height = canvas.height;
	var buffer_ctx = buffer.getContext('2d');

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(images[base_url], 0, 0);

		for (var k in option_map) {
			var select = document.getElementById(k);

			buffer_ctx.globalCompositeOperation = "copy";
			buffer_ctx.drawImage(images[option_map[k].url], 0, 0);
			buffer_ctx.globalCompositeOperation = "source-in";
			buffer_ctx.fillStyle = color_map[select.value];
			buffer_ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.drawImage(buffer, 0 ,0);
		}
	}
	render();
})();