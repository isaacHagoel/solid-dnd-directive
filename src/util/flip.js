export function createFlipper(node, durationMS) {
    let idToRect = new Map();
    let idToAnim = new Map();

    function read(ids) {
        idToRect = new Map();
        Array.from(node.children).forEach((child, index) => {
            idToRect.set(ids[index], child.getBoundingClientRect());
        });
    }
    function flip(ids) {
        Array.from(node.children).forEach((child, index) => {
            const id = ids[index];
            const currentRect = child.getBoundingClientRect();
            const prevRect = idToRect.get(id);
            if (prevRect) {
                const transformX = prevRect.left - currentRect.left;
                const transformY = prevRect.top - currentRect.top;
                if (transformX || transformY) {
                    const keyFrames = [
                        {transform: `translate3d(${transformX}px, ${transformY}px, 0)`},
                        {transform: 'translate3d(0, 0, 0)'}
                    ];
                    const animationObj = child.animate(keyFrames, {duration: durationMS, easing: "ease-out"});
                    idToAnim.set(id, animationObj);
                    animationObj.onfinish = () => idToAnim.delete(id);
                    animationObj.oncancel = () => idToAnim.delete(id);
                }
            }
        });
    }

    return {read, flip};
}
