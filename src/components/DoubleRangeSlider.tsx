import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
  label?: string;
  showLabels?: boolean;
}

export default function DoubleRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = "",
  label,
  showLabels = true,
}: DoubleRangeSliderProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
    [min, max]
  );
  const getValue = useCallback(
    (percentage: number) => Math.round((percentage / 100) * (max - min) + min),
    [min, max]
  );

  const handleMouseDown = (e: React.MouseEvent, handle: "min" | "max") => {
    setIsDragging(handle);
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const newValue = getValue(percentage);

      if (isDragging === "min") {
        const clampedValue = Math.min(newValue, value[1] - step);
        onChange([clampedValue, value[1]]);
      } else {
        const clampedValue = Math.max(newValue, value[0] + step);
        onChange([value[0], clampedValue]);
      }
    },
    [isDragging, value, step, onChange, getValue]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        </div>
      )}

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main slider track */}
        <div
          ref={sliderRef}
          className="relative w-full h-3 bg-slate-100 rounded-full cursor-pointer border border-slate-200 transition-all duration-300 hover:bg-slate-50"
          onMouseDown={(e) => {
            const rect = sliderRef.current?.getBoundingClientRect();
            if (!rect) return;

            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            const newValue = getValue(percentage);

            // Determine which handle to move based on proximity
            const minDistance = Math.abs(newValue - value[0]);
            const maxDistance = Math.abs(newValue - value[1]);

            if (minDistance < maxDistance) {
              handleMouseDown(e, "min");
            } else {
              handleMouseDown(e, "max");
            }
          }}
        >
          {/* Track fill with gradient */}
          <div
            className="absolute h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300 ease-out"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Track glow effect on hover */}
          <div
            className={cn(
              "absolute h-3 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full transition-all duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>

        {/* Min handle */}
        <div
          className={cn(
            "absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
            "hover:scale-110 hover:shadow-xl",
            isDragging === "min" && "scale-110 shadow-xl ring-4 ring-blue-200",
            isHovered && "shadow-md"
          )}
          style={{ left: `${minPercentage}%`, top: "50%" }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
        >
          {/* Handle inner glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full" />
        </div>

        {/* Max handle */}
        <div
          className={cn(
            "absolute w-6 h-6 bg-white border-2 border-green-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
            "hover:scale-110 hover:shadow-xl",
            isDragging === "max" && "scale-110 shadow-xl ring-4 ring-green-200",
            isHovered && "shadow-md"
          )}
          style={{ left: `${maxPercentage}%`, top: "50%" }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
        >
          {/* Handle inner glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-green-50 to-green-100 rounded-full" />
          <div className="absolute inset-2 bg-white rounded-full" />
        </div>

        {/* Active range indicator */}
        <div
          className={cn(
            "absolute h-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
      </div>

      {/* Value labels with professional styling */}
      {showLabels && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {t("common.min")}
            </span>
            <span className="text-lg font-semibold text-slate-900">
              ${value[0].toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-px bg-slate-200 mb-2" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {t("common.range")}
            </span>
            <span className="text-sm font-medium text-slate-600">
              ${(value[1] - value[0]).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {t("common.max")}
            </span>
            <span className="text-lg font-semibold text-slate-900">
              ${value[1].toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Range indicator dots */}
      <div className="flex justify-between mt-2 px-1">
        <div className="flex flex-col items-center">
          <div className="w-1 h-1 bg-slate-300 rounded-full mb-1" />
          <span className="text-xs text-slate-400">
            ${min.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-1 h-1 bg-slate-300 rounded-full mb-1" />
          <span className="text-xs text-slate-400">
            ${max.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
