export default {
    bind: function (el, binding, vNode) {
        const inst = vNode.context;
        //console.log('el', el)
        //console.log('inst', inst)
        /*el.addEventListener("mouseover", (e) => {
            if (el.offsetWidth < el.scrollWidth) {
                inst.isTruncated = true;
            } else {
                inst.isTruncated = false;
            }
        });*/
        el.addEventListener("DOMSubtreeModified", (e) => {
            console.log('DOMSubtreeModified')
            if (el.offsetWidth < el.scrollWidth) {
                inst.isTruncated = true;
            } else {
                inst.isTruncated = false;
            }
        });
        /*inst.$on('DOMSubtreeModified', function(){
            console.log('changed');
            if (el.offsetWidth < el.scrollWidth) {
                inst.isTruncated = true;
            } else {
                inst.isTruncated = false;
            }
        });*/
    },
}
