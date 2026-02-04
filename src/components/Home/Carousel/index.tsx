import type React from "react";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselPry from "../../../assets/Carousel/CarouselPry.svg";
import WirdLogo from "../../../assets/Logo/WirdLogosvg.svg";

export default function CarouselStatistics(): React.ReactElement {
	const { t } = useTranslation();

	return (
		<Carousel className="w-full">
			<CarouselContent>
				{[1, 2, 3].map((_, index) => (
					<CarouselItem key={index}>
						<div className="relative">
							<img className="block w-full" src={CarouselPry} alt={`Slide ${index + 1}`} />
							<div className="mx-auto mt-20 justify-center items-start flex pb-16 flex-col">
								<div className="justify-center -mt-[55rem] flex-col flex -mr-[50rem]">
									<div className="flex justify-center items-start">
										<img src={WirdLogo} alt="" width="200" />
									</div>
									<div className="w-[35rem] justify-center items-start mx-auto">
										<div className="mt-6 pr-8 text-right font-bold text-3xl text-blue-600">
											{t("ourName")}
										</div>
										<div className="mt-8 text-right text-xl text-brand-orange">
											{t("welcomeMsg")}
										</div>
									</div>
								</div>
								<div className="w-[40rem] h-1 bg-red-500 mx-auto mt-16 rounded-full -mr-28" />
								<h3 className="text-center w-full mt-4">{t("ourName")}</h3>
								<p className="text-center w-full">{t("welcomeMsg")}</p>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
