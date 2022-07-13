-- 1) USERS TABLE 
CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(256),
    username VARCHAR(256),
    email VARCHAR(256),
    password VARCHAR(256),
    picture TEXT,
    phone VARCHAR(128),
    city VARCHAR(128),
    street INTEGER,
    zipcode INTEGER
);

-- 2) ROADMAP TABLE 
CREATE TABLE roadmap(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(128),
    created_at DATE DEFAULT NOW()::DATE,
    tagline TEXT,
    icon TEXT
);

-- 3) USER_ROADMAP TABLE 
CREATE TABLE user_roadmap(
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, roadmap_id)
);

-- 4) MILESTONE TABLE 
CREATE TABLE milestone(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(128),
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE
);

-- 5) RESOURCES TABLE 
CREATE TABLE resource(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    tagline TEXT DEFAULT NULL,
    link TEXT,
    milestone_id BIGSERIAL REFERENCES milestone(id) ON DELETE CASCADE
);

-- 6) BOOK TABLE 
CREATE TABLE book(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(256),
    link TEXT,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE
);

-- 7) GUIDED PROJECT TABLE 
CREATE TABLE guidedproject(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(128),
    description TEXT,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE
);

-- 8) SOLUTION TABLE 
CREATE TABLE solution(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    link TEXT,
    guidedproject_id BIGSERIAL REFERENCES guidedproject(id) ON DELETE CASCADE
);

-- 9) WISHLIST TABLE 
CREATE TABLE wishlist(
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, roadmap_id)
);

-- 10) BADGE TABLE 
CREATE TABLE badge(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(128),
    picture TEXT
);

-- 11) USER_BADGE TABLE 
CREATE TABLE user_badge(
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGSERIAL REFERENCES badge(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, badge_id)
);

-- 12) TESTIMONIALS TABLE
CREATE TABLE testimonial(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    content TEXT,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE
);

-- 13) TODO TABLE 
CREATE TABLE todo(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    task TEXT,
    created_at DATE DEFAULT NOW()::DATE,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE
);

-- 14) BLOG TABLE 
CREATE TABLE blog(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(256),
    created_at DATE DEFAULT NOW()::DATE,
    content TEXT,
    picture TEXT
);

-- 15) COMMENT TABLE 
CREATE TABLE comment(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    content TEXT,
    created_at DATE DEFAULT NOW()::DATE,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    blog_id BIGSERIAL REFERENCES blog(id) ON DELETE CASCADE
);



-- 16) QUIZ TABLE 
CREATE TABLE quiz(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    created_at DATE DEFAULT NOW()::DATE,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE
);

-- 17) QUESTION TABLE
CREATE TABLE question(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    content TEXT,
    quiz_id BIGSERIAL REFERENCES quiz(id) ON DELETE CASCADE
); 

-- 18) OPTIONS TABLE 
CREATE TABLE option(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    content TEXT,
    is_correct BOOLEAN,
    question_id BIGSERIAL REFERENCES question(id) ON DELETE CASCADE
);

-- 19) TRENDS TABLE 
CREATE TABLE trend(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(256),
    link TEXT,
    picture TEXT DEFAULT NULL
);

-- 20) USER_MILESTONE TABLE 
CREATE TABLE user_milestone(
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id BIGSERIAL REFERENCES roadmap(id) ON DELETE CASCADE,
    milestone_id BIGSERIAL REFERENCES milestone(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, roadmap_id, milestone_id)
);