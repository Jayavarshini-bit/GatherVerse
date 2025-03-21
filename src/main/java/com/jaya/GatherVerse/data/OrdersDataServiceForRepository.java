package com.jaya.GatherVerse.data;

import com.jaya.GatherVerse.models.OrderEntity;
import com.jaya.GatherVerse.models.OrderModel;
import com.jaya.GatherVerse.services.OrdersBusinessService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

public class OrdersDataServiceForRepository implements OrdersDataAccessInterface<OrderModel>{

    //need a data source
    @Autowired
    OrdersRepositoryInterface ordersRepository;

    private JdbcTemplate jdbcTemplate;

    public OrdersDataServiceForRepository(DataSource dataSource){
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    ModelMapper modelMapper = new ModelMapper();

    @Override
    public OrderModel getById(long id) {
        OrderEntity entity = ordersRepository.findById(id).orElse(null);

        /*OrderModel model = new OrderModel(
                entity.getId(),
                entity.getOrderNo(),
                entity.getProductName(),
                entity.getPrice(),
                entity.getQuantity());
        */
        OrderModel model = modelMapper.map(entity,OrderModel.class);
        return model;
    }

    @Override
    public List<OrderModel> getOrders() {

        Iterable<OrderEntity> ordersEntity = ordersRepository.findAll();

        List<OrderModel> models = new ArrayList<>();
        for(OrderEntity item:ordersEntity){
            //add item to the list of ordermodel
            models.add(modelMapper.map(item, OrderModel.class));
        }

        return models;
    }

    @Override
    public List<OrderModel> searchOrders(String searchTerm) {
        Iterable<OrderEntity> entities = ordersRepository.findByProductNameContainingIgnoreCase(searchTerm);
        List<OrderModel> orders = new ArrayList<>();

        for(OrderEntity entity:entities){
            orders.add(modelMapper.map(entity, OrderModel.class));
        }
        return orders;
    }

    @Override
    public long addOne(OrderModel newOrder) {
        /*OrderEntity entity = modelMapper.map(newOrder,OrderEntity.class);
        OrderEntity result = ordersRepository.save(entity);
        if(result == null){
            return 0;
        }
        else
            return result.getId();*/

        newOrder.setId(null);
        try {
            OrderEntity entity = modelMapper.map(newOrder, OrderEntity.class);
            OrderEntity result = ordersRepository.save(entity);
            return result != null ? result.getId() : 0;
        } catch (Exception e) {
            System.err.println("Error saving order: " + e.getMessage());
            throw new OrdersBusinessService.OrderServiceException("Failed to add order", e);
        }
    }

    @Override
    public boolean deleteOne(long id) {
        ordersRepository.deleteById(id);
        return true;
    }

    @Override
    public OrderModel updateOne(long idToUpdate, OrderModel updateOrder) {
        OrderEntity entity = modelMapper.map(updateOrder,OrderEntity.class);
        OrderEntity result = ordersRepository.save(entity);
        OrderModel order = modelMapper.map(result,OrderModel.class);

        return order;
    }
}
