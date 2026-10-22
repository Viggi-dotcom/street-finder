"use client";

import { useState, useCallback } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}

function StarIcon({
  fill,
  size,
  index,
  onMouseEnter,
  onMouseLeave,
  onClick,
  readonly,
}: {
  fill: "full" | "half" | "empty";
  size: number;
  index: number;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  readonly?: boolean;
}) {
  const starId = `star-grad-${index}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={readonly ? "" : "cursor-pointer"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role={readonly ? "img" : "button"}
      aria-label={`${index + 1} star`}
      tabIndex={readonly ? -1 : 0}
      onKeyDown={(e) => {
        if (!readonly && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      <defs>
        <linearGradient id={starId}>
          {fill === "full" && (
            <>
              <stop offset="100%" stopColor="#f59e0b" />
            </>
          )}
          {fill === "half" && (
            <>
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d1d5db" />
            </>
          )}
          {fill === "empty" && (
            <>
              <stop offset="100%" stopColor="#d1d5db" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${starId})`}
        stroke="#f59e0b"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function StarRating({
  value,
  onChange,
  size = 24,
  readonly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleMouseEnter = useCallback(
    (starIndex: number, e: React.MouseEvent) => {
      if (readonly) return;
      const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      setHoverValue(isLeftHalf ? starIndex + 0.5 : starIndex + 1);
    },
    [readonly]
  );

  const handleClick = useCallback(
    (starIndex: number, e: React.MouseEvent) => {
      if (readonly || !onChange) return;
      const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      onChange(isLeftHalf ? starIndex + 0.5 : starIndex + 1);
    },
    [readonly, onChange]
  );

  const handleMouseLeave = useCallback(() => {
    if (!readonly) setHoverValue(null);
  }, [readonly]);

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Star rating">
      {[0, 1, 2, 3, 4].map((i) => {
        const starValue = i + 1;
        let fill: "full" | "half" | "empty" = "empty";
        if (displayValue >= starValue) fill = "full";
        else if (displayValue >= i + 0.5) fill = "half";

        return (
          <StarIcon
            key={i}
            fill={fill}
            size={size}
            index={i}
            readonly={readonly}
            onMouseEnter={(e) => handleMouseEnter(i, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(i, e)}
          />
        );
      })}
    </div>
  );
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = 16,
}: {
  rating: number;
  reviewCount: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating value={rating} readonly size={size} />
      <span className="text-sm font-semibold text-amber-600">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500">({reviewCount})</span>
    </div>
  );
}
