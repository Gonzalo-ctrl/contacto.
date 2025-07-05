using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Contactos.ToList());

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var contacto = _context.Contactos.Find(id);
            return contacto == null ? NotFound() : Ok(contacto);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Contacto contacto)
        {
            contacto.Id = Guid.NewGuid().ToString();
            _context.Contactos.Add(contacto);
            _context.SaveChanges();
            return Ok(contacto);
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] Contacto contacto)
        {
            var existing = _context.Contactos.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = contacto.Nombre;
            existing.Telefono = contacto.Telefono;
            existing.Email = contacto.Email;
            existing.ImagenBase64 = contacto.ImagenBase64;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var contacto = _context.Contactos.Find(id);
            if (contacto == null) return NotFound();

            _context.Contactos.Remove(contacto);
            _context.SaveChanges();
            return Ok();
        }
    }
}
