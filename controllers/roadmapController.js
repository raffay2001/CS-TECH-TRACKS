const pool = require('./dbConfig');


const roadmapController = async (req, res) => {
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    const allRoadmaps = await pool.query(`SELECT * FROM roadmap`);
    const allRoadmapList = allRoadmaps.rows;
    context['roadmaps'] = allRoadmapList;
    res.render('roadmaps', context);
}

const showRoadmap = async (req, res) => {
    const roadmap_id = req.query.id;
    const roadmapList = await pool.query(`SELECT * FROM roadmap WHERE id = $1`, [roadmap_id]);
    const roadmap = roadmapList.rows[0];

    const roadmapMilestones = await pool.query(`SELECT * FROM milestone WHERE roadmap_id = $1`, [roadmap_id]);
    const roadmapMilestoneList = roadmapMilestones.rows;
    const sortedroadmapMilestoneList = roadmapMilestoneList.sort((a, b) => (a.id > b.id) ? 1 : -1);
    console.log(sortedroadmapMilestoneList);

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
    res.render('roadmap_detail', context);
}

const markMilestoneAsDone = async (req, res) => {
    const milestone_id = req.query.milestone_id;
    const roadmap_id = req.query.roadmap_id;
    const flag = true;
    await pool.query(`UPDATE milestone SET isdone = $1 WHERE id = $2`, [flag, milestone_id]);
    req.flash('success_msg', `Congratulations on completing the milestone 🚀, you still have a long way to go. Keep up the great work.🎉🎉`);
    res.redirect(`/roadmap?id=${roadmap_id}`);
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
    markMilestoneAsDone
}