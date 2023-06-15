import { useEffect, useState, useCallback } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import {cn} from "@/components/lib";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export interface SliderInputProps {
  title: string;
  value: number;
  min: number;
  max: number;
  onChange(newValue: number): void;
  onBlur(): void;
  className?: string;
  interval?: number;
}

export function SliderInput({
  title,
  value,
  min,
  max,
  onChange,
  onBlur,
  className,
  interval,
}: SliderInputProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onChangeChecked = useCallback(
    (sliderValue: number) => {
      if (
        Number.isInteger(sliderValue) &&
        sliderValue >= min &&
        sliderValue <= max
      ) {
        onChange(sliderValue);
      }
    },
    [onChange, min, max]
  );


  useEffect(() => {
    let animation: number;
    let intervalId: any;

    if (isPlaying) {
      intervalId = setInterval(() => {
        animation = requestAnimationFrame(() => {
          let nextValue = value + 1;
          onChangeChecked(nextValue);
        });
      }, interval ? interval : 100);
    }

    return () => {
      clearInterval(intervalId);
      animation != 0 && cancelAnimationFrame(animation);
    };
  });

  const sliderChangeHandler = useCallback(
    ([sliderValue]: number[]) => {
      onChangeChecked(sliderValue);
    },
    [onChangeChecked]
  );

  return (
    <section className={cn("flex", className)}>
      <Button variant="ghost" className="focus:ring-transparent" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Slider
        min={min}
        max={max}
        step={1}
        name={title}
        value={[value]}
        onBlur={onBlur}
        onValueChange={sliderChangeHandler}
        aria-label={title}
        className={cn("w-3/5")}
      />
    </section>
  );
}