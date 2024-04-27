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

  selectedFile: File | undefined;

  codeSelected: string | undefined;

  formAddProduct = this.toolsForm.group({
    'name': ['', [Validators.required]],
    'price': ['', [Validators.required]],
    'stock': ['', [Validators.required]],
    'details': ['', [Validators.required]],
    'image': ['',[Validators.required]]
  }
  )

  @ViewChild('addModalProduct') addModalProduct?: ElementRef<any>;
  @ViewChild('deleteModalProduct') deleteModalProduct?: ElementRef<any>;


  ngOnInit(): void {
    this.showProducts();
    this.listFiltrados = [...this.listDeProductos];
  }

  addProduct() {
    this.modalService.open(this.addModalProduct, {centered: true})
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  imageUrl(producto: ProductModel):string {
    return `http://localhost:3000/uploads/${producto.image}`;
  }
  
  save() {
    if (this.formAddProduct.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error'); 
      return;
    }

    const randomCode = (Math.floor(10000000 + Math.random() * 90000000)).toString();

    const productData: FormData = new FormData();
    productData.append('code', randomCode);
    productData.append('name', this.formAddProduct.get('name')?.value ?? '');
    productData.append('price', this.formAddProduct.get('price')?.value ?? '');
    productData.append('stock', this.formAddProduct.get('stock')?.value ?? '');
    productData.append('details', this.formAddProduct.get('details')?.value ?? '')
    if (this.selectedFile) {
      productData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.pagesService.addProduct(productData).subscribe({
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


  showProducts() {
    this.pagesService.showProduct()
    .subscribe(productos => {
      this.listDeProductos = productos;
      this.listFiltrados = [...this.listDeProductos];
    })
  }

  deleteProduct(code:string) {
    this.codeSelected = code;
    this.modalService.open(this.deleteModalProduct, {centered: true})
  }

  confirmDelete() {
    if (this.codeSelected) {
      this.pagesService.deleteProduct(this.codeSelected).subscribe({
        next: (value) => {
          this.notifycation.success(value.message, 'Éxito');
          this.modalService.dismissAll();
          this.showProducts();
        },
        error: (err) => {
          this.notifycation.error(err.message, 'Error');
        }
      });
    } else {
      console.error('No se proporcionó un código válido para eliminar el producto.')
    }
  }

  filterProduct() {
    this.listFiltrados = this.listDeProductos.filter(
      producto => producto.name.toLowerCase().includes(this.filtroProducto.toLowerCase())
    );
  }
}
