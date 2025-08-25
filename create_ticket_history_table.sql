-- Tạo bảng ticket_history để lưu lịch sử ticket
CREATE TABLE IF NOT EXISTS ticket_history (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    action_by_user_id BIGINT,
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    from_status VARCHAR(100),
    to_status VARCHAR(100),
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ticket_history_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_history_user FOREIGN KEY (action_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_history_created_at ON ticket_history(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_history_action_type ON ticket_history(action_type);

-- Comment cho bảng
COMMENT ON TABLE ticket_history IS 'Lưu lịch sử các thao tác trên ticket từ khi tạo đến khi hoàn thành';
COMMENT ON COLUMN ticket_history.action_type IS 'Loại hành động: CREATED, APPROVED, REJECTED, FORWARDED, STATUS_CHANGED, COMMENTED';
COMMENT ON COLUMN ticket_history.from_status IS 'Trạng thái trước khi thay đổi';
COMMENT ON COLUMN ticket_history.to_status IS 'Trạng thái sau khi thay đổi';
