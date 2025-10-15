-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS bible_verses;
DROP TABLE IF EXISTS bible_books;

-- Create bible_books table
CREATE TABLE bible_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    abbreviation VARCHAR(10) NOT NULL,
    testament ENUM('old', 'new') NOT NULL,
    book_order INT NOT NULL
);

-- Create bible_verses table
CREATE TABLE bible_verses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    chapter INT NOT NULL,
    verse INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES bible_books(id),
    UNIQUE KEY unique_verse (book_id, chapter, verse)
);

-- Create indexes for better performance
CREATE INDEX idx_bible_verses_book_chapter ON bible_verses(book_id, chapter);
CREATE INDEX idx_bible_verses_text ON bible_verses(text(100));

-- Insert Bible books data
INSERT INTO bible_books (name, abbreviation, testament, book_order) VALUES
('Genesis', 'Gen', 'old', 1),
('Exodus', 'Exo', 'old', 2),
('Leviticus', 'Lev', 'old', 3),
('Numbers', 'Num', 'old', 4),
('Deuteronomy', 'Deu', 'old', 5),
('Joshua', 'Jos', 'old', 6),
('Judges', 'Jdg', 'old', 7),
('Ruth', 'Rut', 'old', 8),
('1 Samuel', '1Sa', 'old', 9),
('2 Samuel', '2Sa', 'old', 10),
('1 Kings', '1Ki', 'old', 11),
('2 Kings', '2Ki', 'old', 12),
('1 Chronicles', '1Ch', 'old', 13),
('2 Chronicles', '2Ch', 'old', 14),
('Ezra', 'Ezr', 'old', 15),
('Nehemiah', 'Neh', 'old', 16),
('Esther', 'Est', 'old', 17),
('Job', 'Job', 'old', 18),
('Psalms', 'Psa', 'old', 19),
('Proverbs', 'Pro', 'old', 20),
('Ecclesiastes', 'Ecc', 'old', 21),
('Song of Solomon', 'Son', 'old', 22),
('Isaiah', 'Isa', 'old', 23),
('Jeremiah', 'Jer', 'old', 24),
('Lamentations', 'Lam', 'old', 25),
('Ezekiel', 'Eze', 'old', 26),
('Daniel', 'Dan', 'old', 27),
('Hosea', 'Hos', 'old', 28),
('Joel', 'Joe', 'old', 29),
('Amos', 'Amo', 'old', 30),
('Obadiah', 'Oba', 'old', 31),
('Jonah', 'Jon', 'old', 32),
('Micah', 'Mic', 'old', 33),
('Nahum', 'Nah', 'old', 34),
('Habakkuk', 'Hab', 'old', 35),
('Zephaniah', 'Zep', 'old', 36),
('Haggai', 'Hag', 'old', 37),
('Zechariah', 'Zec', 'old', 38),
('Malachi', 'Mal', 'old', 39),
('Matthew', 'Mat', 'new', 40),
('Mark', 'Mar', 'new', 41),
('Luke', 'Luk', 'new', 42),
('John', 'Joh', 'new', 43),
('Acts', 'Act', 'new', 44),
('Romans', 'Rom', 'new', 45),
('1 Corinthians', '1Co', 'new', 46),
('2 Corinthians', '2Co', 'new', 47),
('Galatians', 'Gal', 'new', 48),
('Ephesians', 'Eph', 'new', 49),
('Philippians', 'Phi', 'new', 50),
('Colossians', 'Col', 'new', 51),
('1 Thessalonians', '1Th', 'new', 52),
('2 Thessalonians', '2Th', 'new', 53),
('1 Timothy', '1Ti', 'new', 54),
('2 Timothy', '2Ti', 'new', 55),
('Titus', 'Tit', 'new', 56),
('Philemon', 'Phm', 'new', 57),
('Hebrews', 'Heb', 'new', 58),
('James', 'Jam', 'new', 59),
('1 Peter', '1Pe', 'new', 60),
('2 Peter', '2Pe', 'new', 61),
('1 John', '1Jo', 'new', 62),
('2 John', '2Jo', 'new', 63),
('3 John', '3Jo', 'new', 64),
('Jude', 'Jud', 'new', 65),
('Revelation', 'Rev', 'new', 66);

-- Insert sample verses (you'll need to add the complete KJV text)
INSERT INTO bible_verses (book_id, chapter, verse, text) VALUES
(1, 1, 1, 'In the beginning God created the heaven and the earth.'),
(1, 1, 2, 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.'),
(1, 1, 3, 'And God said, Let there be light: and there was light.');