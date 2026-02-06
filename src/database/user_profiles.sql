CREATE TABLE user_profile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- Basic User Info
    username VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contact_no VARCHAR(20),

    -- Profile Photo
    profile_photo VARCHAR(255), 
    -- (store file path or URL, not the image itself)

    -- Education Details
    education_level VARCHAR(50) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    graduation_year INT NOT NULL,

    -- Address Details
    address TEXT NOT NULL,
    street VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
