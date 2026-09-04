insert into circle_posts (user_id, author_name, body)
select 'blue-love', 'Blue Love Circle', 'Love is the most powerful force in the Universe. This house is a place to find it, share it, and become it. Fully. Fearlessly. Forever. Eternity is the Now.'
where not exists (select 1 from circle_posts);

insert into circle_posts (user_id, author_name, body)
select 'blue-love', 'House Guide', 'Today''s practice: four minutes of box breath at dawn, then a slow walk without your phone. If you take a supplement, take it with water and a sentence of gratitude — not as a fix, as a vow.'
where (select count(*) from circle_posts) < 2;
