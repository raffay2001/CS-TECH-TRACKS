const { compareSync } = require('bcrypt');
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
        req.flash('info_msg', `Congratulations on completing this Roadmap 🚀, you still have a long way to go. Keep up the great work.🎉 You have now access to the guided project and graded quiz of this roadmap.`);
    }


    const milestoneResources = await pool.query(`SELECT * FROM resource WHERE milestone_id IN (SELECT id FROM milestone WHERE roadmap_id = $1)`, [roadmap_id]);
    const milestoneResourceList = milestoneResources.rows;

    let context = {
        'title': roadmap['title'],
        'icon': roadmap['icon'],
        'roadmap_id': roadmap['id'],
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
    const guidedProjects = await pool.query(`SELECT * FROM guidedproject WHERE roadmap_id = $1`, [roadmap_id]);
    const guidedProjectList = guidedProjects.rows;
    const solutions = await pool.query(`SELECT * FROM solution WHERE guidedproject_id IN (SELECT id FROM guidedproject WHERE roadmap_id = $1)`, [roadmap_id]);
    const solutionList = solutions.rows;

    let context = {
        'title': 'GUIDED PROJECTS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    context['projects'] = guidedProjectList;
    context['solutions'] = solutionList; 
    
    res.render('guided_project', context);
}

const showQuiz = async (req, res) => {
    const roadmap_id = req.query.id;
    let context = {
        'title': 'QUIZ',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
        'isQuizSubmitted': false
    }
    const roadmapQuizes = await pool.query(`SELECT * FROM quiz WHERE roadmap_id = $1`, [roadmap_id]);
    const roadmapQuiz = roadmapQuizes.rows[0];
    const quizId = roadmapQuiz['id'];
    const allQuestions = await pool.query(`SELECT * FROM question WHERE quiz_id = $1`, [quizId]);
    const allQuestionList = allQuestions.rows;
    const allOptions = await pool.query(`SELECT * FROM option WHERE question_id IN (SELECT id FROM question WHERE quiz_id = $1)`, [quizId]);
    const allOptionList = allOptions.rows;
    context['questions'] = allQuestionList;
    context['options'] = allOptionList;
    res.render('quiz', context);
}

const submitQuiz = async (req, res) => {
    let context = {
        'title': 'QUIZ',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
        'isQuizSubmitted': false
    }
    context['isQuizSubmitted'] = true;
    const roadmap_id = req.query.id;

    const roadmapQuizes = await pool.query(`SELECT * FROM quiz WHERE roadmap_id = $1`, [roadmap_id]);
    const roadmapQuiz = roadmapQuizes.rows[0];
    const quizId = roadmapQuiz['id'];
    const allQuestions = await pool.query(`SELECT * FROM question WHERE quiz_id = $1`, [quizId]);
    const allQuestionList = allQuestions.rows;
    const allOptions = await pool.query(`SELECT * FROM option WHERE question_id IN (SELECT id FROM question WHERE quiz_id = $1)`, [quizId]);
    const allOptionList = allOptions.rows;

    // Object that Contains User Submitted Questions Along With Options 
    let userQuestionObj = {};

    // Object that Contains Original Questions Along With Correct Options 
    let correctQuestionObj = {};


    // Fetching The Questions And User Selected Options From the Client Side 
    for(let i = 0; i<allQuestionList.length; i++){
        for(let j in req.body){
            if(allQuestionList[i]['content']===j){
                userQuestionObj[allQuestionList[i]['content']] = req.body[j];
            }
        }
    }

    // Fetching the Original Questions Along With Correct From the Database 
    for(let i = 0; i<allQuestionList.length; i++){
        for(let j = 0; j<allOptionList.length; j++){
            if(allQuestionList[i]['id']===allOptionList[j]['question_id']){
                if(allOptionList[j]['is_correct']){
                    correctQuestionObj[allQuestionList[i]['content']] = allOptionList[j]['content'];
                }
            }
        }   
    }

    // Variable to Hold the Number of Correct Answers 
    let correctAnswers = 0;

    // Variable to Hold the Total Number of Answers 
    let totalAnswers = Object.keys(correctQuestionObj).length;

    // Comparing User Submitted Questions with the Original Questions To Calculate the Grade 
    for(let k in correctQuestionObj){
        for(let l in userQuestionObj){
            if(k===l){
                if(correctQuestionObj[k]===userQuestionObj[l]){
                    correctAnswers += 1;
                }
            }
        }
    }

    // Calculating the Grade of the User
    let grade = Math.ceil((correctAnswers/totalAnswers)*100);

    if(grade<50){
        // Passing the Message telling the Grade to the User
        req.flash('info_msg', `Sorry, you fail to pass this quiz.Your Grade is: ${grade}% ): You can try again later.The correct answers are shown below`);
    }
    else if(grade>=50&&grade<=70){
        // Passing the Message telling the Grade to the User
        req.flash('info_msg', `You Grade is: ${grade}% for this Quiz.Keep up the great work and keep learning.The correct answers are shown below`);
    }
    else{
        // Passing the Message telling the Grade to the User
        req.flash('success_msg', `Congratulations🎉🎉, You Grade is: ${grade}% for this Quiz. Keep up the great work and keep learning. The correct answers are shown below`);
    }


    console.log('Original Resource: ', correctQuestionObj);
    console.log('User Submitted: ', userQuestionObj);
    console.log(`User Has ${correctAnswers} Correct Answers And The Grade of the User is: ${grade}`);
    context['questions'] = allQuestionList;
    context['options'] = allOptionList;
    res.render('quiz', context);
}



module.exports = {
    roadmapController,
    showRoadmap,
    showGuidedProject,
    showQuiz,
    markMilestoneAsDone,
    pickRoadmap,
    showUserRoadmaps,
    submitQuiz
}