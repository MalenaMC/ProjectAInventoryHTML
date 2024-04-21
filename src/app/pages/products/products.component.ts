import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagesService, ProductModel } from '../../services/pages.service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private pagesService = inject(PagesService);
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService);

  listDeProductos: ProductModel[] = [];
  listFiltrados: ProductModel[] = [];

  filtroProducto: string = '';


  codeSelected: string | undefined;

  formAddProduct = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'price': ['', [Validators.required]],
    'stock': ['', [Validators.required]]
  }
  )

  @ViewChild('addModalProduct') addModalProduct?: ElementRef<any>;
  @ViewChild('deleteModalProduct') deleteModalProduct?: ElementRef<any>;


  ngOnInit(): void {
    this.showProducts();
    this.listFiltrados = [...this.listDeProductos];
  }

  addProduct() {
    console.log('Add product');
    this.modalService.open(this.addModalProduct, {centered: true})
  }

  deleteProduct() {
    console.log('delete')
    //this.codeSelected = code;
    this.modalService.open(this.deleteModalProduct, {centered: true})
  }

  save() {
    if (this.formAddProduct.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error'); 
      return;
    }

    const randomCode = (Math.floor(10000000 + Math.random() * 90000000)).toString();

    this.pagesService.addProduct({
      code: randomCode,
      name: this.formAddProduct.get('name')?.value ?? '',
      price: Number(this.formAddProduct.get('price')?.value) ?? 0,
      stock: Number(this.formAddProduct.get('stock')?.value) ?? 0,
    }).subscribe({
      next: (value) => {
        console.log(value),
        this.notifycation.success(`Producto ${value.name} ${value.message} `, 'Éxito'),
        this.formAddProduct.reset(),
        this.showProducts()
      },
      error: (err) => {
        this.notifycation.error(err.message, 'error');
      }
    })
  }

  showProducts():void {
    this.pagesService.showProduct()
    .subscribe(productos => {
      this.listDeProductos = productos;
      this.listFiltrados = [...this.listDeProductos];
    })
  }

  /*deleteP() {
    this.pagesService.deleteProduct(this.codeSelected).subscribe({
      next: (value) => {
        this.notifycation.success(value.message, 'Éxito');
        this.showProducts();
      },
      error: (err) => {
        this.notifycation.error(err.message, 'Error');
      }
    });
  }*/

  filterProduct() {
    this.listFiltrados = this.listDeProductos.filter(
      producto => producto.name.toLowerCase().includes(this.filtroProducto.toLowerCase())
    );
  }
}
