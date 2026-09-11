import {
  motion,
} from "framer-motion";

import {
  BrainCircuit,
} from "lucide-react";

export function EvaluationOrb() {
  return (
    <div className="evaluation-orb-wrap">
      <motion.div
        className="evaluation-orb-ring evaluation-orb-ring--outer"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="evaluation-orb-ring evaluation-orb-ring--middle"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="evaluation-orb-core"
        animate={{
          scale: [
            1,
            1.06,
            1,
          ],
          boxShadow: [
            "0 0 30px rgba(151,86,255,.35)",
            "0 0 75px rgba(151,86,255,.62)",
            "0 0 30px rgba(151,86,255,.35)",
          ],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
        }}
      >
        <BrainCircuit
          size={38}
        />
      </motion.div>
    </div>
  );
}