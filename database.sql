CREATE TABLE stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    update_type VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stats_user_id ON stats (user_id);
CREATE INDEX idx_stats_created_at ON stats (created_at);
CREATE INDEX idx_stats_user_id_created_at ON stats (user_id, created_at);
