package ua.com.mescherskiy.mediahosting.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
//@AllArgsConstructor
//@NoArgsConstructor
public class RegisterRequest {

    @Valid

    @NotNull(message = "Name is required")
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Email(message = "Invalid email format")
    @NotNull(message = "Email is required")
    @NotBlank(message = "Email is required")
    @Size(max = 50, message = "Email is too long")
    private String email;

    private Set<String> role;

    @NotNull(message = "Password is required")
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;
}
