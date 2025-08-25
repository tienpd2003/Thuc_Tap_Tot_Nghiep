package com.example.thuc_tap.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldOption {
    private String value;   // Giá trị thực tế
    private String label;   // Nhãn hiển thị
    @Builder.Default
    private boolean disabled = false;
    @Builder.Default
    private boolean selected = false;
}
