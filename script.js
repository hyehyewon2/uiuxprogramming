const serviceName = "퍼블리싱 성장 서비스";
let isSubscribed = false;
let submitCount = 0;
/* 실행중 달라질 수 있ㄴ는 값 */

function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
        ? "연습을 시작할 수 있습니다"
        : "동의 후 연습을 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.remove("is-ready");
    } else {
        agreeMessage.classList.add("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = "#" + clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress__item");

const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");

const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");

const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");

const durationValues = ["30", "60", "90"];

const formData = {
    title: "", duration: "60", qna: false, qnaCount: "2"
};

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    recordingDialog.showModal();
});

recordingCancel.addEventListener("click", () => {
    recordingDialog.close();
    revokeRecordingAgreement();
});

recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

recordingConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    recordingDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior: "smooth"})  ;
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
        titleError.textContent = "과제 제목을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "분";
});

qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));

optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count.value;

    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "분";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));

finishButton.addEventListener("click", () => showStep(3));

restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "60";
    formData.qna = false;
    formData.qnaCount = "2";

    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");

    durationRange.value = "1";
    durationValue.value = "60분";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;

    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";

    showStep(0);
});

/* 중간고사 추가 기능 : 내 코드 접근성 점검 */

const a11yOpen = document.querySelector("#a11y-open");
const a11yCheck = document.querySelector("#a11y-check");
const a11yTarget = document.querySelector("#a11y-target");
const a11yItems = document.querySelectorAll(".a11y-item");
const a11yError = document.querySelector("#a11y-error");
const a11yResult = document.querySelector("#a11y-result");
const a11yScore = document.querySelector("#a11y-score");
const a11yClose = document.querySelector("#a11y-close");
const a11yReset = document.querySelector("#a11y-reset");
const a11ySubmit = document.querySelector("#a11y-submit");
const a11yNew = document.querySelector("#a11y-new");

function resetA11y() {
    a11yItems.forEach((item) => {
        item.checked = false;
        document.querySelector("#" + item.dataset.tip).hidden = true;
    });


    a11yError.textContent = "";
    a11yScore.textContent = "";
    a11yResult.classList.remove("is-success", "is-partial");
    a11yResult.hidden = true;
}



a11yOpen.addEventListener("click", () => {
    a11yTarget.textContent = "\"" + formData.title + "\" 과제의 코드를 점검합니다.";
    a11yCheck.hidden = false;
    a11yCheck.scrollIntoView({ behavior: "smooth" });
    a11yItems[0].focus();
});

// 결과 보기 : 체크한 개수 세고 체크 안 한 항목은 해결방법을 보여준다.
a11ySubmit.addEventListener("click", () => {
    let count = 0;

    a11yItems.forEach((item) => {
        const tip = document.querySelector("#" + item.dataset.tip);
        if (item.checked) {
            count += 1;
            tip.hidden = true;
        } else {
            tip.hidden = false;
        }
    });
    if (count === 0) {
        a11yError.textContent = "확인한 항목에 하나 이상 체크해 주세요.";
        a11yResult.hidden = true;
        a11yItems[0].focus();
        return;
    }

    a11yError.textContent = "";
    a11yResult.hidden = false;

    if (count === a11yItems.length) {
        a11yScore.textContent = count + " / " + a11yItems.length + " 축하드립니다! 접근성 기본 점검이 통과되었습니다!^__^";
        a11yResult.classList.add("is-success");
        a11yResult.classList.remove("is-partial");
    } else {
        a11yScore.textContent = count + " / " + a11yItems.length + " 통과되었습니다. 아래 내용을 확인하고 수정해 주세요.";
        a11yResult.classList.add("is-partial");
        a11yResult.classList.remove("is-success");
    }
});

a11yReset.addEventListener("click", () => {
    resetA11y();
    a11yItems[0].focus();
});

// 닫기는 체크한 값은 그대로 두고 영역만 숨긴다.
a11yClose.addEventListener("click", () => {
    a11yCheck.hidden = true;
    a11yOpen.focus();
});

restartButton.addEventListener("click", () => {
    resetA11y();
    a11yCheck.hidden = true;
});

a11yNew.addEventListener("click", () => {
    restartButton.click();
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});
