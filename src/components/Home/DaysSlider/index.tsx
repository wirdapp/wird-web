import type React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import LeftArrowIcon from "../../../assets/icons/Home/LeftArrow.svg";
import RightArrowIcon from "../../../assets/icons/Home/RightArrow.svg";
import "swiper/css";

import { useTranslation } from "react-i18next";
import type { Swiper as SwiperType } from "swiper";

function DaysSlider(): React.ReactElement {
	const { t } = useTranslation();
	return (
		<div className="mx-auto mt-12 w-full rounded-3xl max-w-[59.375rem]">
			<div className="font-bold text-2xl leading-[1.8125rem] text-black">{t("ongingContst")}</div>

			<div className="flex items-center w-auto justify-between">
				{/* Left arrow */}
				<div className="flex flex-row items-center p-[1.125rem] gap-3 w-[3.75rem] h-[3.75rem] bg-[#f9eaea] rounded-full">
					<img src={LeftArrowIcon} alt="" className="text-black mx-auto" />
				</div>

				{/* Days slider */}
				<div className="w-[90%] h-36 overflow-hidden p-0 gap-5 max-w-[49.3125rem] flex flex-row items-center mx-auto">
					<Swiper
						style={{ width: "auto" }}
						spaceBetween={1}
						slidesPerView={5}
						onSlideChange={() => console.log("slide change")}
						onSwiper={(swiper: SwiperType) => console.log(swiper)}
					>
						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex mx-auto flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent rounded-xl focus:bg-white focus:shadow-[0rem_0.75rem_1.5rem_rgba(167,159,151,0.24)]"
							>
								<div className="flex w-5 h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									12
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex mx-auto flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent rounded-xl focus:bg-white focus:shadow-[0rem_0.75rem_1.5rem_rgba(167,159,151,0.24)]"
							>
								<div className="flex w-5 h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									13
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex mx-auto flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent rounded-xl focus:bg-white focus:shadow-[0rem_0.75rem_1.5rem_rgba(167,159,151,0.24)]"
							>
								<div className="flex flex-row items-center p-0 gap-[0.375rem] w-[2.6875rem] h-[1.8125rem]">
									<div className="flex w-5 h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
										14
									</div>
									<div className="w-3 h-3 rounded-[1.875rem] ms-[0.3125rem] bg-[#ff5367]" />
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent opacity-[0.24] rounded-xl"
							>
								<div className="w-[1.5625rem] h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									15
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent opacity-[0.24] rounded-xl"
							>
								<div className="w-[1.5625rem] h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									16
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent opacity-[0.24] rounded-xl"
							>
								<div className="w-[1.5625rem] h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									17
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent opacity-[0.24] rounded-xl"
							>
								<div className="w-[1.5625rem] h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									18
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>

						<SwiperSlide style={{ width: "auto" }}>
							<button
								type="button"
								className="flex flex-col items-center p-[1.125rem] gap-[0.375rem] w-[7.125rem] h-[5.625rem] bg-transparent opacity-[0.24] rounded-xl"
							>
								<div className="w-[1.5625rem] h-[1.8125rem] font-bold text-2xl leading-[1.8125rem] text-center text-black">
									19
								</div>
								<div className="w-[4.875rem] h-[1.1875rem] font-normal text-base leading-5 text-center text-[#a79f97]">
									{t("ramadan")}
								</div>
							</button>
						</SwiperSlide>
					</Swiper>
				</div>

				{/* Right arrow */}
				<div className="flex flex-row items-center p-[1.125rem] gap-3 w-[3.75rem] h-[3.75rem] bg-[#f9eaea] rounded-full">
					<img src={RightArrowIcon} alt="" className="text-black mx-auto" />
				</div>
			</div>
		</div>
	);
}
export default DaysSlider;
