DELETE FROM pages WHERE created_at < now()-'24 hours'::interval RETURNING *;