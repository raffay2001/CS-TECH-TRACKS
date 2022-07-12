const roadmapController = async(req, res) => {
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('roadmaps', context);
}

const showRoadmap = async (req, res) => {
    const roadmap_id = req.query.id;
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('roadmap_detail', context);
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
    showQuiz
}