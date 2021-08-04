import d01 from "../public/assets/icons/weather_icon_pack/d01.svg";
import d02 from "../public/assets/icons/weather_icon_pack/d02.svg";
import d03 from "../public/assets/icons/weather_icon_pack/d03.svg";
import d04 from "../public/assets/icons/weather_icon_pack/d04.svg";
import d09 from "../public/assets/icons/weather_icon_pack/d09.svg";
import d10 from "../public/assets/icons/weather_icon_pack/d10.svg";
import d11 from "../public/assets/icons/weather_icon_pack/d11.svg";
import d13 from "../public/assets/icons/weather_icon_pack/d13.svg";
import d50 from "../public/assets/icons/weather_icon_pack/d50.svg";
import n01 from "../public/assets/icons/weather_icon_pack/n01.svg";
import n02 from "../public/assets/icons/weather_icon_pack/n02.svg";
import n04 from "../public/assets/icons/weather_icon_pack/n04.svg";
import n09 from "../public/assets/icons/weather_icon_pack/n09.svg";
import n10 from "../public/assets/icons/weather_icon_pack/n10.svg";
import n11 from "../public/assets/icons/weather_icon_pack/n11.svg";
import n13 from "../public/assets/icons/weather_icon_pack/n13.svg";
import n50 from "../public/assets/icons/weather_icon_pack/n50.svg";

export default function setWeatherIcon(element, icon) {
	switch (icon) {
		// day time
		case "01d":
			element.src = d01;
			break;
		case "02d":
			element.src = d02;
			break;
		case "03d":
			element.src = d03;
			break;
		case "04d":
			element.src = d04;
			break;
		case "09d":
			element.src = d09;
			break;
		case "10d":
			element.src = d10;
			break;
		case "11d":
			element.src = d11;
			break;
		case "13d":
			element.src = d13;
			break;
		case "50d":
			element.src = d50;
			break;
		// // night time
		case "01n":
			element.src = n01;
			break;
		case "02n":
			element.src = n02;
			break;
		// case "03n" is same as "03d"
		case "04n":
			element.src = n04;
			break;
		case "09n":
			element.src = n09;
			break;
		case "10n":
			element.src = n10;
			break;
		case "11n":
			element.src = n11;
			break;
		case "13n":
			element.src = n13;
			break;
		case "50n":
			element.src = n50;
			break;
		default:
			// if some error set as cloud d03
			element.src = d03;
			break;
	}
}
