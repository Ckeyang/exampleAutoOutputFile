
  $(function(){
    
        //上下角标
        detailManager.keyListener = function (event) {
            var dicUp = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻'];
            var dicDown = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₊', '₋'];
            var ctrl = event.ctrlKey;
            var alt = event.altKey;
            var shift = event.shiftKey;
            var key = event.which;
            //字母键盘
            if (ctrl && alt && key === 48) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[0]);
            } else if (alt && key === 48 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[0]);
            } else if (ctrl && alt && key === 49) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[1]);
            } else if (alt && key === 49 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[1]);
            } else if (ctrl && alt && key === 50) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[2]);
            } else if (alt && key === 50 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[2]);
            } else if (ctrl && alt && key === 51) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[3]);
            } else if (alt && key === 51 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[3]);
            } else if (ctrl && alt && key === 52) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[4]);
            } else if (alt && key === 52 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[4]);
            } else if (ctrl && alt && key === 53) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[5]);
            } else if (alt && key === 53 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[5]);
            } else if (ctrl && alt && key === 54) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[6]);
            } else if (alt && key === 54 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[6]);
            } else if (ctrl && alt && key === 55) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[7]);
            } else if (alt && key === 55 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[7]);
            } else if (ctrl && alt && key === 56) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[8]);
            } else if (alt && key === 56 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[8]);
            } else if (ctrl && alt && key === 57) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[9]);
            } else if (alt && key === 57 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[9]);
            } else if (ctrl && alt && key === 187) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[10]);
            } else if (alt && key === 187 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[10]);
            } else if (ctrl && alt && key === 189) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[11]);
            } else if (alt && key === 189 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[11]);
            }
            //数字键盘
            else if (ctrl && alt && key === 96) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[0]);
            } else if (alt && key === 96 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[0]);
            } else if (ctrl && alt && key === 97) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[1]);
            } else if (alt && key === 97 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[1]);
            } else if (ctrl && alt && key === 98) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[2]);
            } else if (alt && key === 98 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[2]);
            } else if (ctrl && alt && key === 99) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[3]);
            } else if (alt && key === 99 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[3]);
            } else if (ctrl && alt && key === 100) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[4]);
            } else if (alt && key === 100 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[4]);
            } else if (ctrl && alt && key === 101) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[5]);
            } else if (alt && key === 101 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[5]);
            } else if (ctrl && alt && key === 102) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[6]);
            } else if (alt && key === 102 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[6]);
            } else if (ctrl && alt && key === 103) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[7]);
            } else if (alt && key === 103 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[7]);
            } else if (ctrl && alt && key === 104) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[8]);
            } else if (alt && key === 104 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[8]);
            } else if (ctrl && alt && key === 105) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[9]);
            } else if (alt && key === 105 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[9]);
            } else if (ctrl && alt && key === 107) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[10]);
            } else if (alt && key === 107 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[10]);
            } else if (ctrl && alt && key === 109) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicUp[11]);
            } else if (alt && key === 109 && !ctrl) {
                if (event.preventDefault()) {
                    event.preventDefault()
                } else {
                    event.returnValue = false;
                }
                var resultVal = $(event.target).val();
                $(event.target).val(resultVal + dicDown[11]);
            }
        }

    

        detailManager.init();
    }
)