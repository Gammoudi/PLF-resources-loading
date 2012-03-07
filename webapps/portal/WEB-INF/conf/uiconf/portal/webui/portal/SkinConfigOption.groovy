/**
 * Copyright (C) 2009 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

import java.util.List;
import java.util.ArrayList;
import org.exoplatform.webui.core.model.SelectItemCategory;
import org.exoplatform.webui.core.model.SelectItemOption;

List categories = new ArrayList();

  SelectItemCategory skinDefault = new  SelectItemCategory("Default", false);
  skinDefault.addSelectItemOption(new SelectItemOption("Default", "Default", "Default"));
  skinDefault.setSelected(true);
  categories.add(skinDefault);
  
  SelectItemCategory skinMac = new  SelectItemCategory("Mac", false);
  skinMac.addSelectItemOption(new SelectItemOption("Mac", "Mac", "Mac"));
  categories.add(skinMac);
  
  SelectItemCategory skinVista = new  SelectItemCategory("Vista", false);
  skinVista.addSelectItemOption(new SelectItemOption("Vista", "Vista", "Vista"));
  categories.add(skinVista);
  
return categories;  