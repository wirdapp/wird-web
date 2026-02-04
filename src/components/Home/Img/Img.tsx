import type React from "react";
import { useTranslation } from "react-i18next";
import CarouselPry from "../../../assets/Carousel/CarouselPry.svg";
import WirdLogo from "../../../assets/Logo/WirdLogosvg.svg";

export default function Img(): React.ReactElement {
	const { t } = useTranslation();
	return (
		<div>
			<img className="d-block w-100" src={CarouselPry} alt="First slide" />
			<section className="mx-auto mt-20 justify-center items-start flex pb-16 flex-col">
				<div className="justify-center mt-[-55rem] flex-col flex me-[-50rem] items-center mx-auto">
					<div className="flex justify-center items-start">
						<img src={WirdLogo} alt="" width="200" />
					</div>

					<section className="w-[35rem] justify-center items-start mx-auto">
						<div className="mt-6 pe-8 text-right font-extrabold text-[1.8rem] text-[#2980b9]">
							{t("ourName")}
						</div>
						<div className="mt-8 text-right text-[1.4rem] text-orange-500">
							{t("welcomeMsg")}
						</div>
					</section>
				</div>
				<div className="w-[40rem] h-[0.3rem] bg-[#e94f57] mx-auto mt-16 rounded-[20px] me-0">
				</div>
				<h3>{t("ourName")} </h3>
				<p> {t("welcomeMsg")}</p>
			</section>
		</div>
	);
}
