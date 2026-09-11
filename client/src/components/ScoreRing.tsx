import {
  motion,
} from "framer-motion";

export function ScoreRing({
  score,
}: {
  score: number;
}) {
  const radius =
    78;

  const circumference =
    2 *
    Math.PI *
    radius;

  const offset =
    circumference -
    (
      score /
      100
    ) *
      circumference;

  return (
    <div className="score-ring">
      <svg
        viewBox="0 0 190 190"
      >
        <circle
          className="score-ring-track"
          cx="95"
          cy="95"
          r={radius}
        />

        <motion.circle
          className="score-ring-value"
          cx="95"
          cy="95"
          r={radius}
          initial={{
            strokeDashoffset:
              circumference,
          }}
          animate={{
            strokeDashoffset:
              offset,
          }}
          transition={{
            duration: 1.4,
            ease: "easeOut",
          }}
          style={{
            strokeDasharray:
              circumference,
          }}
        />
      </svg>

      <div className="score-ring-label">
        <strong>
          {score}
        </strong>

        <span>
          / 100
        </span>
      </div>
    </div>
  );
}