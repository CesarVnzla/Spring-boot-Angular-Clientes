package com.bolsadeideas.springboot.backend.apirest.controllers;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.tomcat.jni.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bolsadeideas.springboot.backend.apirest.model.entity.Cliente;
import com.bolsadeideas.springboot.backend.apirest.models.services.IClientesService;
/**
 * 
 * @author CesarVnzla
 *
 */

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api")
public class ClienteResController {  
	
	@Autowired
	private IClientesService clienteService;
	
	@GetMapping("/clientes")
	public List<Cliente> index() {
		
		return clienteService.findAll();

		
		
	}
	
	/**
	 * 
	 * Creando la variable para paginar 
	 * @param page
	 * @return
	 */
	
	@GetMapping("/clientes/page/{page}")
	public Page<Cliente> index(@PathVariable Integer page) {
		
		// variable para paginar ---> Pageable pageable = PageRequest.of(page, 4);
		
		return clienteService.findAll(PageRequest.of(page, 4));
	}
	
	/**
	 * Buscar Cliente por id
	 * @param id
	 * @return
	 */
	
	@GetMapping("/clientes/{id}")
	public ResponseEntity<?> show(@PathVariable Long id) {
		
		Cliente cliente= null;
		Map<String, Object> response= new HashMap<>();
		
		try { 
			
			cliente= clienteService.findById(id);
			
		} catch(DataAccessException e) {
			
			response.put("mensaje", "Ocurrio un Error en la base de Datos!");
			response.put("mensaje", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			
		}
		
		if (cliente == null) {
			
			response.put("mensaje", "El Cliente ID: ".concat(id.toString().concat(" no existe en la base de datos!")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
	}
	
	
	
	
	/**
	 * Creando Cliente en la base de Datos
	 * @param cliente
	 * @param result
	 * @return
	 */
	@PostMapping("/clientes")
	public ResponseEntity<?>  create(@Valid @RequestBody Cliente cliente, BindingResult result) {
	
		Cliente clienteNew = null;
		Map<String, Object> response= new HashMap<>();
		
		if(result.hasErrors()) {
			
			//---------------Manejando Errores con Java 8 Stream -------------------
			
			List<String> errors = result.getFieldErrors().stream().map( err -> "El campo '" + err.getField() +"' "+err.getDefaultMessage()
			).collect(Collectors.toList());
			
			
			
			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		
		try { 
			
			clienteNew = clienteService.save(cliente);
			
		} catch(DataAccessException e) {
			
			response.put("error", "Ocurrio un Error al Crear un cliente!"); 
			response.put("mensaje", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			
			
		}
		
		response.put("mensaje", "El cliente ha sido creado con exito"); 
		response.put("cliente", clienteNew);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED );
	}
	
	
	
	/**
	 * Actualizacion de Cliente
	 * @param cliente
	 * @param result
	 * @param id
	 * @return
	 */
	@PutMapping("/clientes/{id}")
	public ResponseEntity<?> update(@Valid  @RequestBody Cliente cliente, BindingResult result, @PathVariable Long id) {
		
		Cliente clienteActual = clienteService.findById(id);
		Cliente clienteUpdate = null;
		Map<String, Object> response= new HashMap<>();
		
			if(result.hasErrors()) {
			
			
			//---------------Manejando Errores con Java 8 Stream -------------------
			
			List<String> errors = result.getFieldErrors().stream().map( err -> "El campo '" + err.getField() +"' "+err.getDefaultMessage()
			).collect(Collectors.toList());
			
			
			
			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
			
		
		if (clienteActual == null) {
			
			response.put("mensaje", " Error no se pudo editar, el Cliente ID: ".concat(id.toString().concat(" no existe en la base de datos!")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		
		try {
		
		clienteActual.setNombre(cliente.getNombre());
		clienteActual.setApellido(cliente.getApellido());
		clienteActual.setEmail(cliente.getEmail());
		clienteActual.setCreateAt(cliente.getCreateAt());
		clienteUpdate = clienteService.save(clienteActual);	
		
		} catch(DataAccessException e) {
			
			response.put("mensajee", "Error al actualizar el Cliente en la base de datos");
			response.put("mensaje", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			
			
		}
		
		response.put("mensaje", "El cliente se ha actualizado con exito"); 
		response.put("cliente", clienteUpdate);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED );
	}
	
	 
	/*
	 * Borrar un cliente de la base de datos 
	 * @param id
	 */
	@DeleteMapping("/clientes/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		
		Map<String, Object> response= new HashMap<>();
		
		
		try {
				Cliente cliente = clienteService.findById(id);
				String nombreFotoAnterior = cliente.getFoto();
			
			if(nombreFotoAnterior != null && nombreFotoAnterior.length() > 0) {
				
				Path rutaFotoAnterior = Paths.get("uploads").resolve(nombreFotoAnterior).toAbsolutePath();
				
				java.io.File archivoFotoAnterior = rutaFotoAnterior.toFile();
				
				if (archivoFotoAnterior.exists() && archivoFotoAnterior.canRead()) {
					
					archivoFotoAnterior.delete();
					
				}
			}
			
			clienteService.delete(id);
			
			
		} catch(DataAccessException e) {
			
			response.put("mensajee", "Error al eliminar el Cliente en la base de datos");
			response.put("mensaje", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("mensaje", "Eliminado con exito");
		return new ResponseEntity<Map<String, Object>> (response, HttpStatus.OK);
		

	}
	/**
	 * Cargar imagen al cliente 
	 * aun no esta aplicada al Front-end
	 * @param archivo
	 * @param id
	 * @return
	 */
	@PostMapping("/clientes/upload")
	public ResponseEntity<?> upload(@RequestParam("archivo") MultipartFile archivo, @RequestParam("id") Long id ) {
		
		Map<String, Object> response= new HashMap<>();
		
		Cliente cliente = clienteService.findById(id);
		
		if(!archivo.isEmpty()) {
			
			String nombreArchivo = UUID.randomUUID().toString() +"_"+ archivo.getOriginalFilename().replace(" ", "");
			Path rutaArchivo = Paths.get("uploads").resolve(nombreArchivo).toAbsolutePath();
			
			try {
				Files.copy(archivo.getInputStream(), rutaArchivo);
			} catch (IOException e) {
				
			response.put("mensajee", "Error al subir la imagen");
			response.put("mensaje", e.getMessage().concat(": ").concat(e.getCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}
			
			String nombreFotoAnterior = cliente.getFoto();
			
			if(nombreFotoAnterior != null && nombreFotoAnterior.length() > 0) {
				
				Path rutaFotoAnterior = Paths.get("uploads").resolve(nombreFotoAnterior).toAbsolutePath();
				
				java.io.File archivoFotoAnterior = rutaFotoAnterior.toFile();
				
				if (archivoFotoAnterior.exists() && archivoFotoAnterior.canRead()) {
					
					archivoFotoAnterior.delete();
					
				}
			}
			
			cliente.setFoto(nombreArchivo);
			clienteService.save(cliente);
			
			response.put("cliente", cliente);
			response.put("mensaje", "Has subido correctamente la imagen: ");
		}
		
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED );
		
	}


}
