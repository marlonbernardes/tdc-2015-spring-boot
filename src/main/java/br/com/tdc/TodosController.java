package br.com.tdc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;


@Controller
public class TodosController {

    @Autowired
    private TodoRepository repository;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "todos";
    }


    @ResponseBody
    @RequestMapping(value = "/api/all", method = RequestMethod.GET)
    public Iterable<Todo> all() {
        return repository.findAll();
    }

    @ResponseBody
    @RequestMapping(value = "/api/save", method = RequestMethod.POST)
    public Iterable<Todo> save(@RequestBody Todo todo) {
        repository.save(todo);
        return repository.findAll();
    }

    @ResponseBody
    @RequestMapping(value = "/api/delete/{id}", method = RequestMethod.DELETE)
    public Iterable<Todo> delete(@PathVariable Integer id) {
        repository.delete(id);
        return repository.findAll();
    }

}
