import React from 'react';

interface GradientStarIconProps {
  height?: string;
  width?: string;
  gradientColors?: {
    start: string;
    end: string;
  };
  uniqueId: string;
}

const GradientStarIcon: React.FC<GradientStarIconProps> = ({
  height = '24',
  width = '24',
  gradientColors = { start: '#B973FE', end: '#8305FF' },
  uniqueId
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 210 206"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`gradient-${uniqueId}-1`} x1="88" y1="30" x2="88" y2="206" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientColors.start} />
          <stop offset="1" stopColor={gradientColors.end} />
        </linearGradient>
        <linearGradient id={`gradient-${uniqueId}-1`} x1="158.5" y1="0" x2="158.5" y2="103" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientColors.start} />
          <stop offset="1" stopColor={gradientColors.end} />
        </linearGradient>
        <linearGradient id={`gradient-${uniqueId}-1`} x1="148.5" y1="135" x2="148.5" y2="206" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientColors.start} />
          <stop offset="1" stopColor={gradientColors.end} />
        </linearGradient>
      </defs>
      <path
        d="M87.3408 30H87.3359C86.9819 78.0761 48.0761 116.982 0 117.336V117.341C48.2965 117.696 87.3383 156.958 87.3383 205.338C87.3383 205.559 87.3375 205.78 87.3359 206H87.3408C87.3397 205.855 87.339 205.71 87.3386 205.565C87.3384 205.489 87.3383 205.414 87.3383 205.338C87.3383 156.737 126.737 117.338 175.338 117.338C175.492 117.338 175.646 117.339 175.8 117.34C175.866 117.34 175.933 117.34 176 117.341V117.336C175.78 117.338 175.559 117.338 175.338 117.338C126.958 117.338 87.6964 78.2965 87.3408 30Z"
        fill={`url(#gradient-${uniqueId}-1)`}
      />
      <path
        d="M158.114 0H158.111C157.904 28.1355 135.135 50.9042 107 51.1114V51.1142C135.264 51.3223 158.113 74.2993 158.113 102.613C158.113 102.742 158.112 102.871 158.111 103H158.114C158.114 102.915 158.113 102.83 158.113 102.745C158.113 102.701 158.113 102.657 158.113 102.613C158.113 74.1701 181.17 51.1128 209.613 51.1128C209.703 51.1128 209.793 51.113 209.883 51.1135C209.922 51.1137 209.961 51.1139 210 51.1142V51.1114C209.871 51.1123 209.742 51.1128 209.613 51.1128C181.299 51.1128 158.322 28.2644 158.114 0Z"
        fill={`url(#gradient-${uniqueId}-1)`}
      />
      <path
        d="M148.234 135H148.232C148.089 154.394 132.394 170.089 113 170.232V170.234C132.483 170.378 148.233 186.216 148.233 205.733C148.233 205.822 148.233 205.911 148.232 206H148.234C148.234 205.942 148.233 205.883 148.233 205.824C148.233 205.794 148.233 205.764 148.233 205.733C148.233 186.127 164.127 170.233 183.733 170.233C183.795 170.233 183.857 170.233 183.919 170.234C183.946 170.234 183.973 170.234 184 170.234V170.232C183.911 170.233 183.822 170.233 183.733 170.233C164.216 170.233 148.378 154.483 148.234 135Z"
        fill={`url(#gradient-${uniqueId}-1)`}
      />
    </svg>
  );
};

export default GradientStarIcon
