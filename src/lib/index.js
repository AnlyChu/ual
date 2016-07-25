/**
 * Created by Anly.Z on 16/7/22.
 */

var slideToggle = {
 showOrHide:function (index) {
    var display = false;
    var other = document.querySelectorAll('.showOrHide');
    for (var i = 0, len = other.length; i < len; i++) {
        if (other[i] != other[index]) {
            if (parseInt(other[i].style.height) > 0) {
                display = false;
                slideToggleTrans(i, display);
            }
        }
    }
    var ele = document.querySelectorAll('.showOrHide')[index];
    if (parseInt(ele.style.height) > 0) {
        display = true;
    }
    display = !display;
    slideToggleTrans(index, display);
}

// 应用渐进使用transition交互的slideToggle效果
 slideToggleTrans: function(index, display)  { //  display表示默认更多展开元素是显示状态还是隐藏
    var eleMore = document.querySelectorAll('.showOrHide')[index];
    eleMore && (eleMore.style.height = display ? (function () {
        var height = 0;
        Array.prototype.slice.call(eleMore.childNodes).forEach(function (child) {
            if (child.nodeType === 1) {
                var oStyle = window.getComputedStyle(child);
                height += child.clientHeight + (parseInt(oStyle.borderTopWidth) || 0) + (parseInt(oStyle.borderBottomWidth) || 0);
            }
        });
        return height;
    })() + "px" : "0px");
}

};

window.slideToggle = slideToggle;