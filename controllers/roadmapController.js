const pool = require('./dbConfig');


const roadmapController = async (req, res) => {
    const user_id = req.user.id;
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    const allRoadmaps = await pool.query(`SELECT * FROM roadmap`);
    const allRoadmapList = allRoadmaps.rows;

    const userRoadmaps = await pool.query(`SELECT * FROM roadmap WHERE id IN (SELECT roadmap_id FROM user_roadmap WHERE user_id = $1)`,[user_id]);
    const userRoadmapList = userRoadmaps.rows;

    for(let i = 0; i<allRoadmapList.length; i++){
        for(let j = 0; j<userRoadmapList.length; j++){
            if(allRoadmapList[i]['id']===userRoadmapList[j]['id']){
                allRoadmapList[i]['pickRoadmapButtonFlag'] = false; 
                break;
            }
        }
        if(!allRoadmapList[i].hasOwnProperty('pickRoadmapButtonFlag')){
            allRoadmapList[i]['pickRoadmapButtonFlag'] = true; 
        }
    }

    context['roadmaps'] = allRoadmapList;
    res.render('roadmaps', context);
}

const showRoadmap = async (req, res) => {
    const user_id = req.user.id;
    const roadmap_id = req.query.id;
    let pickRoadmapButtonFlag = true;
    let isRoadmapDone = false;
    const roadmapList = await pool.query(`SELECT * FROM roadmap WHERE id = $1`, [roadmap_id]);
    const roadmap = roadmapList.rows[0];

    const roadmapMilestones = await pool.query(`SELECT * FROM milestone WHERE roadmap_id = $1`, [roadmap_id]);
    const roadmapMilestoneList = roadmapMilestones.rows;
    const sortedroadmapMilestoneList = roadmapMilestoneList.sort((a, b) => (a.id > b.id) ? 1 : -1);

    const userRoadmaps = await pool.query(`SELECT * FROM roadmap WHERE id IN (SELECT roadmap_id FROM user_roadmap WHERE user_id = $1)`, [user_id]);
    const userRoadmapList = userRoadmaps.rows;

    for(let i = 0; i<userRoadmapList.length; i++){
        if(roadmap['id'] === userRoadmapList[i]['id']){
            pickRoadmapButtonFlag = false;
        }
    }

    const userSelectedMilestones = await pool.query(`SELECT * FROM milestone WHERE id IN (SELECT milestone_id FROM user_milestone WHERE user_id = $1 AND roadmap_id = $2)`, [user_id, roadmap_id]);
    const userSelectedMilestoneList = userSelectedMilestones.rows;

    for(let j = 0; j<sortedroadmapMilestoneList.length; j++){
        // console.log('In the first loop', sortedroadmapMilestoneList[j]);
        for(let k = 0; k<userSelectedMilestoneList.length; k++){
            if(sortedroadmapMilestoneList[j]['id']===userSelectedMilestoneList[k]['id']){
                sortedroadmapMilestoneList[j]['isMilestonedone'] = true;
                break;
            }
        }
        if(!sortedroadmapMilestoneList[j].hasOwnProperty('isMilestonedone')){
            sortedroadmapMilestoneList[j]['isMilestonedone'] = false;
        }
    }

    if(userSelectedMilestoneList.length === sortedroadmapMilestoneList.length) {
        isRoadmapDone = true;
    }


    const milestoneResources = await pool.query(`SELECT * FROM resource WHERE milestone_id IN (SELECT id FROM milestone WHERE roadmap_id = $1)`, [roadmap_id]);
    const milestoneResourceList = milestoneResources.rows;

    let context = {
        'title': roadmap['title'],
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
        'roadmap': roadmap
    }
    context['milestones'] = sortedroadmapMilestoneList;
    context['resources'] = milestoneResourceList;
    context['pickRoadmapButtonFlag'] = pickRoadmapButtonFlag;
    context['isRoadmapDone'] = isRoadmapDone;
    res.render('roadmap_detail', context);
}

const markMilestoneAsDone = async (req, res) => {
    const milestone_id = req.query.milestone_id;
    const roadmap_id = req.query.roadmap_id;
    const user_id = req.user.id;
    await pool.query(`INSERT INTO user_milestone (user_id, roadmap_id, milestone_id) VALUES ($1, $2, $3);`, [user_id, roadmap_id, milestone_id]);
    req.flash('success_msg', `Congratulations on completing the milestone 🚀, you still have a long way to go. Keep up the great work.🎉🎉`);
    res.redirect(`/roadmap?id=${roadmap_id}`);
}

const pickRoadmap = async (req, res) => {
    const user_id = req.user.id;
    const roadmap_id = req.query.id;
    await pool.query(`INSERT INTO user_roadmap (user_id, roadmap_id) VALUES ($1, $2)`, [user_id, roadmap_id]);
    req.flash('success_msg', `Congratulations 🎉🎉 for picking this roadmap, you are on your way to accomplish the most critical mission of your life. Best of Luck for your journey.`);
    res.redirect('/user-roadmaps');
}


const showUserRoadmaps = async (req, res) => {
    const user_id = req.user.id;
    let context = {
        'title': 'YOUR ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }

    const userRoadmaps = await pool.query(`SELECT * FROM roadmap WHERE id IN (SELECT roadmap_id FROM user_roadmap WHERE user_id = $1)`, [user_id]);
    const userRoadmapList = userRoadmaps.rows;
    context['roadmaps'] = userRoadmapList;

    res.render('user_roadmaps', context);
}


const showGuidedProject = async (req, res) => {
    const roadmap_id = req.query.id;
    let context = {
        'title': 'GUIDED PROJECT',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('guided_project', context);
}

const showQuiz = async (req, res) => {
    const roadmap_id = req.query.id;
    let context = {
        'title': 'GUIDED PROJECT',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('quiz', context);
}

module.exports = {
    roadmapController,
    showRoadmap,
    showGuidedProject,
    showQuiz,
    markMilestoneAsDone,
    pickRoadmap,
    showUserRoadmaps
}