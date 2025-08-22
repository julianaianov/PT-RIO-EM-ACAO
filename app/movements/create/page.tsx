import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createMovement } from "@/lib/movement-actions"
import { SelectHidden } from "@/components/select-hidden"
import { movementCategories, movementRegions } from "@/lib/movements-options"

export default function CreateMovementPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
			<div className="container mx-auto px-4 py-6 max-w-3xl">
				<Card className="border-red-200">
					<CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
						<CardTitle>Cadastrar Movimento</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<form action={createMovement} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Nome</Label>
									<Input id="name" name="name" required />
								</div>
								<div>
									<Label htmlFor="category">Categoria</Label>
									<SelectHidden name="category" options={movementCategories} />
								</div>
								<div>
									<Label htmlFor="region">Região</Label>
									<SelectHidden name="region" options={movementRegions} />
								</div>
								<div>
									<Label htmlFor="founded">Fundado em</Label>
									<Input id="founded" name="founded" placeholder="2018" />
								</div>
								<div>
									<Label htmlFor="members">Nº de membros</Label>
									<Input id="members" name="members" type="number" min={0} />
								</div>
								<div>
									<Label htmlFor="image_url">Imagem (URL)</Label>
									<Input id="image_url" name="image_url" placeholder="https://..." />
								</div>
							</div>

							<div>
								<Label htmlFor="description">Descrição</Label>
								<Textarea id="description" name="description" required rows={5} />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
									<Input id="whatsapp" name="whatsapp" placeholder="21999999999" />
								</div>
								<div>
									<Label htmlFor="instagram">Instagram</Label>
									<Input id="instagram" name="instagram" placeholder="@perfil" />
								</div>
								<div>
									<Label htmlFor="facebook">Facebook</Label>
									<Input id="facebook" name="facebook" placeholder="pagina" />
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									<Input id="email" name="email" type="email" />
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="website">Website</Label>
									<Input id="website" name="website" placeholder="www.exemplo.org" />
								</div>
							</div>

							<div className="flex items-center justify-end gap-2">
								<Button variant="outline" className="bg-transparent" type="reset">Limpar</Button>
								<Button className="bg-red-600 hover:bg-red-700" type="submit">Salvar Movimento</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
} 