package br.com.tdc;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@SpringBootApplication
public class Application {

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String name() {
        return "world";
    }
    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}
