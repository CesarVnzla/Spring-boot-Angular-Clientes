package com.bolsadeideas.springboot.backend.apirest.model.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
/**
 * 
 * @author CesarVnzla
 *
 */

@Entity
@Table(name="clientes")
public class Cliente implements Serializable {
	
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private long id;
	
	@NotEmpty
	@Size(min=4, max=12)
	@Column(nullable = false)
	private String nombre;
	
	@NotEmpty
	private String apellido;
	
	@NotEmpty
	@Email
	@Column(nullable = false, unique = false)
	private String email;
	
	@NotNull(message = " el campo no puede estar vacio")
	@Column(name="create_art")
	@Temporal(TemporalType.DATE)
	private Date createAt;
	
	private String Foto;
	
	
	// Para la creacion de la fecha y hora automatica 
	 
	/*@PrePersist
	public void prePersister() {
		createAt = new Date();
	}*/
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getApellido() {
		return apellido;
	}
	public void setApellido(String apellido) {
		this.apellido = apellido;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Date getCreateAt() {
		return createAt;
	}
	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}
	
	
	public String getFoto() {
		return Foto;
	}
	public void setFoto(String foto) {
		Foto = foto;
	}




	private static final long serialVersionUID = 1L;         
	
	
}
