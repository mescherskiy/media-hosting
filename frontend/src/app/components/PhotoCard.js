import { useMotionValue } from "framer-motion"
import { memo, useRef } from "react"
import { Link } from "react-router-dom"



export const PhotoCard = memo(
    ({
        isSelected,
        history,
        user,
        id
    }) => {
        const y = useMotionValue(0)
        const zIndex = useMotionValue(isSelected ? 2 : 0)

        const cardRef = useRef(null)

        function checkZIndex(latest) {
            if (isSelected) {
                zIndex.set(2)
            } else if (!isSelected && latest.scaleX < 1.01) {
                zIndex.set(0)
            }
        }

        return (
            <li className={"card"}>
                <Overlay isSelected={isSelected} />
                <div className={`card-content-container ${isSelected && "open"}`}>
                    <motion.div
                        className={"card-content"}
                        style={{ zIndex, y }}
                        layoutTransition={isSelected ? openSpring : closeSpring}
                        drag={isSelected ? "y" : false}
                        onUpdate={checkZIndex}>
                            <Photo id={id} isSelected={isSelected} />
                    </motion.div>
                </div>
                {!isSelected && <Link to={id} className={"card-open-link"} />}
            </li>
        )
    },
    (prev, next) => prev.isSelected === next.isSelected
)

const Overlay = ({ isSelected }) => {
    <motion.div
        initial={false}
        animate={{opacity: isSelected ? 1 : 0}}
        transition={{duration: 0.2}}
        style={{pointerEvents: isSelected ? "auto" : "none"}}
        className="overlay">
            <Link to="/vault" />
        </motion.div>
}