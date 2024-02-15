package ua.com.mescherskiy.mediahosting.security;

import jakarta.servlet.FilterRegistration;
import jakarta.servlet.ServletContext;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;
import org.springframework.web.filter.DelegatingFilterProxy;

public class SecurityInitializer extends AbstractSecurityWebApplicationInitializer {

    @Override
    protected void beforeSpringSecurityFilterChain(ServletContext servletContext) {
        FilterRegistration.Dynamic filterRegistration = servletContext.addFilter("reactRouterFilter", new ReactRouterFilter());
        filterRegistration.addMappingForUrlPatterns(null, false, "/*");

        servletContext
                .addFilter("delegatingFilterProxy", DelegatingFilterProxy.class)
                .addMappingForUrlPatterns(null, false, "/*");
    }
}
