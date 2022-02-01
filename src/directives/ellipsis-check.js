export default {
    bind: function (el, binding, vNode) {
        const inst = vNode.context;
        el.addEventListener("mouseover", (e) => {
            if (el.offsetWidth < el.scrollWidth) {
                inst.isTruncated = true;
            } else {
                inst.isTruncated = false;
            }
        });
    },
}
