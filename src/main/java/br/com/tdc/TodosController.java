package br.com.tdc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;


@Controller
public class TodosController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "todos";
    }


    @ResponseBody
    @RequestMapping(value = "/api/all", method = RequestMethod.GET)
    public List<Todo> all() {
        return Arrays.asList(new Todo(1, "do something", false), new Todo(2, "something else", true));
    }

}
