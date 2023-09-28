import React from "react";
import { motion } from "framer-motion";
import { closeSpring } from "./animation"

export const Photo = ({
    id,
    isSelected,
    pointOfInterest = 0
}) => {
    return (
        <motion.div
            className="card-image-container"
            style={{originX: 0, originY: 0}}>
                <motion.img
                    className="card-image"
                    src=""
                    alt=""
                    initial={false}
                    animate={
                        isSelected ? { x: -20, y: -20 } : { x: -pointOfInterest, y: 0 }
                    }
                    transition={closeSpring}
                    />
        </motion.div>
    )
}