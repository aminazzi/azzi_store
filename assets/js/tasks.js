/* =========================================
   🎯 AZZI STORE TASKS
========================================= */

const AZZI_TASKS = [

    ["🧭","اكتشف جميع الأقسام","10",10],

    ["❤️","أضف 3 منتجات إلى المفضلة","30",30],

    ["⭐","أضف 10 منتجات إلى المفضلة","80",80],

    ["🎰","جرّب عجلة الحظ 3 مرات","100",100],

    ["⏱️","اقضِ ساعة كاملة في الموقع","150",150],

    ["📦","زر 5 منتجات مختلفة","200",200],

    ["⭐","أضف تقييمًا للموقع","300",300],

    ["🔗","أضف 10 أشخاص إلى الموقع","500",500],

    ["👥","أضف 25 شخصًا إلى الموقع","700",700],

    ["👑","أضف 50 شخصًا إلى الموقع","1000",1000]

];


let taskData = null;


/* فتح المهام */

async function openTasks() {

    const user = await getCurrentUser();

    if (!user) {

        window.location.href =
            "pages/login.html";

        return;
    }

    document
        .getElementById("tasksPage")
        .classList.add("active");

    await loadTaskData();
}
/* إغلاق */

function closeTasks() {

    document
        .getElementById("tasksPage")
        .classList.remove("active");
}


/* تحميل التقدم */

async function loadTaskData() {

    const user = await getCurrentUser();

    if (!user) return;


    const { data } =
        await supabaseClient
            .from("user_task_progress")
            .select("*")
            .eq("user_id",user.id)
            .maybeSingle();


    taskData = data || {

        sections: [],
        favorites: [],
        products: [],
        wheel_spins: 0,
        active_seconds: 0,
        review_done: false,
        referrals: 0,
        claimed: []

    };


    renderTasks();
}
/* عرض المهام */

function renderTasks() {

    const list =
        document.getElementById("tasks-list");

    if (!list) return;


    const sections =
        taskData.sections?.length || 0;

    const favorites =
        taskData.favorites?.length || 0;

    const products =
        taskData.products?.length || 0;

    const wheel =
        taskData.wheel_spins || 0;

    const seconds =
        taskData.active_seconds || 0;

    const referrals =
        taskData.referrals || 0;


    const progress = [

        `${sections}/6`,

        `${Math.min(favorites,3)}/3`,

        `${Math.min(favorites,10)}/10`,

        `${Math.min(wheel,3)}/3`,

        `${Math.min(seconds,3600)}/3600`,

        `${Math.min(products,5)}/5`,

        taskData.review_done
            ? "1/1"
            : "0/1",

        `${Math.min(referrals,10)}/10`,

        `${Math.min(referrals,25)}/25`,

        `${Math.min(referrals,50)}/50`

    ];
list.innerHTML =
        AZZI_TASKS.map(
            (task,index) => {

                const id = index + 1;

                const claimed =
                    taskData.claimed?.includes(id);


                return `

                <div class="task-card">

                    <div class="task-icon">
                        ${task[0]}
                    </div>

                    <div class="task-info">

                        <strong>
                            ${task[1]}
                        </strong>

                        <small>
                            التقدم:
                            ${progress[index]}
                        </small>

                    </div>

                    <div class="task-reward">
                        ⭐ ${task[2]}
                    </div>

                    <button
                        class="task-claim
                        ${claimed ? "claimed" : ""}"
                        onclick="claimTask(${id})"
                        ${claimed ? "disabled" : ""}>

                        ${
                            claimed
                            ? "تم ✓"
                            : "استلام"
                        }

                    </button>

                </div>

                `;

            }
        ).join("");
}
/* استلام المكافأة */

async function claimTask(id) {

    const { data,error } =
        await supabaseClient.rpc(
            "claim_task",
            {
                p_task:id
            }
        );


    if (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء استلام المكافأة"
        );

        return;
    }


    if (!data.ok) {

        alert(
            "⏳ " + data.message
        );

        return;
    }


    alert(
        `🎉 مبروك! حصلت على ⭐ ${data.reward} نقطة`
    );


    await loadTaskData();


    if (
        typeof showPoints ===
        "function"
    ) {

        await showPoints();

    }

}


/* تسجيل حدث */

async function taskEvent(
    type,
    value = null
) {

    try {

        await supabaseClient.rpc(
            "task_event",
            {
                p_type:type,
                p_value:value
            }
        );

    } catch(error) {

        console.error(
            "Task event:",
            error
        );

    }

}
/* عداد الوقت */

setInterval(
    async function() {

        const user =
            await getCurrentUser();

        if (!user) return;

        await supabaseClient.rpc(
            "task_heartbeat"
        );

    },
    60000
);
