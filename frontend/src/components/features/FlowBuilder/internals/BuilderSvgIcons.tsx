export default function BuilderSvgIcons() {
  return (
    <svg style={{ position: 'absolute', left: '-200%', top: '-200%' }}>
      {/* Flow input shape */}
      <defs>
        <clipPath id="triggerNode-clip-path">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.8782 0C8.83248 0 -0.121826 8.9543 -0.121826 20V50C-0.121826 61.0457 8.83247 70 19.8782 70H219.878C230.924 70 239.878 61.0457 239.878 50V46.8341C234.203 45.8819 229.878 40.946 229.878 35C229.878 29.054 234.203 24.1181 239.878 23.1659V20C239.878 8.95431 230.924 0 219.878 0H19.8782Z"
          />
        </clipPath>
      </defs>

      {/* Flow Item node shape */}
      <defs>
        <clipPath id="node-clip-path">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-0.121932 20C-0.121932 8.9543 8.83237 0 19.8781 0H219.878C230.924 0 239.878 8.95431 239.878 20V23.1659C234.203 24.1181 229.878 29.054 229.878 35C229.878 40.946 234.203 45.8819 239.878 46.8341V50C239.878 61.0457 230.924 70 219.878 70H19.8781C8.83237 70 -0.121932
            61.0457 -0.121932 50V46.8341C5.55349 45.8819 9.87807 40.946 9.87807 35C9.87807 29.054 5.55349 24.1181 -0.121932 23.1659V20Z"
          />
          {/* smooth radius */}
          {/* <path fillRule="evenodd" clipRule="evenodd" d="M9.87807 35C9.87807 29.0967 5.61532 24.1889 0 23.187C0.246746 16.5268 0.992819 12.2647 3.24868 8.8886C4.70785
          6.70479 6.58286 4.82978 8.76666 3.37061C13.8111 0 20.8334 0 34.8781 0H204.878C218.923 0 225.945 0 230.989 3.37061C233.173 4.82978 235.048 6.70479 236.507 8.8886C238.763 12.2647
          239.509 16.5268 239.756 23.187C234.141 24.1889 229.878 29.0967 229.878 35C229.878 40.9033 234.141 45.8111 239.756 46.813C239.509 53.4732 238.763 57.7353 236.507 61.1114C235.048 63.2952 233.173 65.1702 230.989 66.6294C225.945
          70 218.923 70 204.878 70H34.8781C20.8334 70 13.8111 70 8.76666 66.6294C6.58286 65.1702 4.70785 63.2952 3.24868 61.1114C0.992818 57.7353 0.246746 53.4732 0 46.813C5.61532 45.8111 9.87807 40.9033 9.87807 35Z" /> */}
        </clipPath>
      </defs>

      {/* Flow Tool Router shape */}
      <defs>
        <clipPath id="tools-clip-path">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64 38C64 32.3084 67.9625 27.5422 73.2793 26.3097C68.4559 11.0647 54.0373 0 37 0C20.0295 0 5.65718 10.9782 0.777832 26.1308C6.56218 26.9898 11 31.9767 11 38C11 43.9119 6.72483 48.8253 1.09741 49.8173C6.26138 64.4776 20.3855 75 37 75C53.6909 75 67.8684 64.3807 72.9732 49.615C67.8111 48.2736 64 43.5819 64 38Z"
            fill="#C4C4C4"
          />
        </clipPath>
      </defs>

      {/* edge end marker */}
      <defs>
        <marker
          id="edge-end-marker"
          viewBox="0 0 45 45"
          refX="12"
          refY="12"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <polyline
            stroke="var(--accent-color)"
            fill="none"
            strokeWidth="3"
            points="9 18 15 12 9 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="33.5" cy="12" r="1.7" fill="var(--accent-color)" />
        </marker>
      </defs>

      {/* connection end marker */}
      <defs>
        <marker
          id="connection-marker"
          viewBox="0 0 40 40"
          refX="12"
          refY="12"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <polyline
            stroke="var(--accent-color)"
            fill="none"
            strokeWidth="3"
            points="9 18 15 12 9 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
    </svg>
  )
}
