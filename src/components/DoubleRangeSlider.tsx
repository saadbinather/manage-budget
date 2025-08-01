import React, { useState, useRef, useEffect } from "react";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export default function DoubleRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = "",
}: DoubleRangeSliderProps) {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;
  const getValue = (percentage: number) =>
    Math.round((percentage / 100) * (max - min) + min);

  const handleMouseDown = (e: React.MouseEvent, handle: "min" | "max") => {
    setIsDragging(handle);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, value]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sliderRef}
        className="w-full h-2 bg-slate-200 rounded-lg relative cursor-pointer"
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
        {/* Track fill */}
        <div
          className="absolute h-2 bg-blue-500 rounded-lg"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="absolute w-5 h-5 bg-blue-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          style={{ left: `${minPercentage}%`, top: "50%" }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
        />

        {/* Max handle */}
        <div
          className="absolute w-5 h-5 bg-green-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          style={{ left: `${maxPercentage}%`, top: "50%" }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
        />
      </div>

      {/* Value labels */}
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>${value[0].toLocaleString()}</span>
        <span>${value[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
